package main

import (
	"log"
	"math/rand"
	"sync"
	"sync/atomic"
	"time"
)

// A little utility that simulates performing a task for a random duration.
// For example, calling do(10, "Remy", "is cooking") will compute a random
// number of milliseconds between 5000 and 10000, log "Remy is cooking",
// and sleep the current goroutine for that much time.

func do(seconds int, action ...any) {
	log.Println(action...)
	randomMillis := 500*seconds + rand.Intn(500*seconds)
	time.Sleep(time.Duration(randomMillis) * time.Millisecond)
}

// Represents an order placed by a customer, with details for processing and delivery.
type Order struct {
	id         uint64      // Unique order ID.
	customer   string      // Customer who placed the order.
	replyChan  chan *Order // Channel used by cooks to send back prepared orders.
	preparedBy string      // Name of the cook who prepared the meal.
}

// Global atomic counter to generate unique order IDs across all orders.
var orderCounter atomic.Uint64

// Buffered channel used by waiters to manage a queue of up to 3 orders at a time.
var waiter = make(chan *Order, 3)

// Simulates a cook who processes orders from the waiter channel until shutdown.
func cook(name string, wg *sync.WaitGroup, shutdown <-chan struct{}) {
	defer wg.Done() // Decrements the wait group counter when the goroutine exits.
	log.Println(name, "starting work")

	for {
		select {
		case <-shutdown: // Gracefully exit if the restaurant shuts down.
			log.Println(name, "shutting down")
			return
		case order, ok := <-waiter: // Fetch an order from the waiter if available.
			if !ok {
				// Channel closed, no more orders to process.
				return
			}
			// Simulate cooking the order.
			do(10, name, "cooking order", order.id, "for", order.customer)
			order.preparedBy = name // Assign the cook's name to the order.

			// Attempt to deliver the prepared meal to the customer.
			select {
			case order.replyChan <- order: // Successfully deliver the meal.
			case <-shutdown: // Exit if shutdown occurs during delivery.
				return
			}
		}
	}
}

// Simulates a customer who places up to 5 orders and eats the meals before leaving.
func customer(name string, wg *sync.WaitGroup, shutdown <-chan struct{}) {
	defer wg.Done() // Decrements the wait group counter when the goroutine exits.

	mealsEaten := 0 // Counter to track the number of meals the customer has eaten.
	for mealsEaten < 5 {
		select {
		case <-shutdown: // Exit early if the restaurant shuts down.
			log.Println(name, "leaving early due to restaurant closing")
			return
		default:
			// Create a new order with a unique ID and reply channel.
			order := &Order{
				id:        orderCounter.Add(1),
				customer:  name,
				replyChan: make(chan *Order, 1),
			}
			log.Println(name, "placed order", order.id)

			// Try to place the order with the waiter, with a 7-second timeout.
			select {
			case waiter <- order: // Successfully placed the order.
				select {
				case meal := <-order.replyChan: // Wait for the cooked meal.
					// Simulate eating the meal.
					do(2, name, "eating cooked order", meal.id, "prepared by", meal.preparedBy)
					mealsEaten++
				case <-shutdown: // Exit if shutdown occurs while waiting for the meal.
					log.Println(name, "leaving while waiting for meal due to restaurant closing")
					return
				}
			case <-time.After(7 * time.Second): // Abandon order if the waiter is busy.
				do(5, name, "waiting too long, abandoning order", order.id)
			}
		}
	}
	log.Println(name, "going home after eating 5 meals")
}

// Main function to simulate the restaurant's operation.
func main() {
	rand.Seed(time.Now().UnixNano()) // Seed the random number generator.

	// Configuration: customers and cooks in the simulation.
	customers := []string{"Ani", "Bai", "Cat", "Dao", "Eve", "Fay", "Gus", "Hua", "Iza", "Jai"}
	cooks := []string{"Remy", "Colette", "Linguini"}
	var wg sync.WaitGroup           // Wait group to ensure all goroutines finish.
	shutdown := make(chan struct{}) // Channel to signal restaurant shutdown.

	// Launch cook goroutines for each cook in the simulation.
	for _, cookName := range cooks {
		wg.Add(1)
		go cook(cookName, &wg, shutdown)
	}

	// Launch customer goroutines for each customer in the simulation.
	for _, customerName := range customers {
		wg.Add(1)
		go customer(customerName, &wg, shutdown)
	}

	// Schedule the restaurant to close after 20 seconds.
	time.AfterFunc(20*time.Second, func() {
		log.Println("Restaurant closing")
		close(shutdown) // Signal all goroutines to stop.
	})

	// Wait for all goroutines to finish before exiting.
	wg.Wait()
	log.Println("Restaurant has closed")
}
