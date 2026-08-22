exception Negative_Amount

let change amount =
  if amount < 0 then
    raise Negative_Amount
  else
    let denominations = [25; 10; 5; 1] in
    let rec aux remaining = function
      | [] -> []
      | d :: ds -> (remaining / d) :: aux (remaining mod d) ds
    in
    aux amount denominations

(* Finds the first element in a list that satisfies a predicate and applies a function to it. *)
let first_then_apply arr predicate func =
  try Some (func (List.find predicate arr))
  with Not_found -> None

(* Generates an infinite sequence of powers of a given base. *)
let powers_generator base =
  let rec aux current =
    Seq.Cons (current, fun () -> aux (current * base))
  in
  aux 1

(* Counts non-empty, non-comment lines in a file. *)
let meaningful_line_count filename =
  let ic = open_in filename in
  let rec count_lines acc =
    try
      let line = input_line ic in
      let trimmed = String.trim line in
      if trimmed = "" || String.get trimmed 0 = '#' then
        count_lines acc
      else
        count_lines (acc + 1)
    with End_of_file ->
      close_in ic; acc
  in
  count_lines 0

(* Defines shapes and computes volume or surface area. *)
type shape =
  | Box of { width : float; length : float; depth : float }
  | Sphere of { radius : float }

let volume shape =
  match shape with
  | Box { width; length; depth } -> width *. length *. depth
  | Sphere { radius } -> (4.0 /. 3.0) *. Float.pi *. (radius ** 3.0)

let surface_area shape =
  match shape with
  | Box { width; length; depth } ->
      2.0 *. ((width *. length) +. (width *. depth) +. (length *. depth))
  | Sphere { radius } -> 4.0 *. Float.pi *. (radius ** 2.0)

(* Binary search tree implementation. *)
module BinarySearchTree = struct
  type 'a tree =
    | Empty
    | Node of { value : 'a; left : 'a tree; right : 'a tree }

  (* Inserts a value into the tree. *)
  let rec insert tree value =
    match tree with
    | Empty -> Node { value; left = Empty; right = Empty }
    | Node { value = v; left; right } ->
        if value < v then Node { value = v; left = insert left value; right }
        else if value > v then Node { value = v; left; right = insert right value }
        else tree

  (* Checks if a value exists in the tree. *)
  let rec contains tree value =
    match tree with
    | Empty -> false
    | Node { value = v; left; right } ->
        if value = v then true
        else if value < v then contains left value
        else contains right value

  (* Computes the number of nodes in the tree. *)
  let rec size tree =
    match tree with
    | Empty -> 0
    | Node { left; right; _ } -> 1 + size left + size right

  (* Produces an inorder sequence of tree values. *)
  let rec inorder tree =
    match tree with
    | Empty -> Seq.empty
    | Node { value; left; right } ->
        Seq.append (inorder left) (Seq.cons value (inorder right))

  (* Returns a string representation of the tree. *)
  let to_string tree =
    let rec aux = function
      | Empty -> "()"
      | Node { value; left; right } -> "(" ^ aux left ^ string_of_int value ^ aux right ^ ")"
    in
    aux tree
end
