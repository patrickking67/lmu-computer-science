-- Computes the smallest number of U.S. coins for a given amount.
function change(amount)
  if math.type(amount) ~= "integer" then
    error("Amount must be an integer")
  end
  if amount < 0 then
    error("Amount cannot be negative")
  end
  local counts, remaining = {}, amount
  for _, denomination in ipairs({25, 10, 5, 1}) do
    counts[denomination] = remaining // denomination -- Calculate count for each denomination.
    remaining = remaining % denomination -- Update remaining amount.
  end
  return counts
end

-- Returns the first string in a sequence that satisfies a predicate, converted to lowercase.
function first_then_lower_case(sequence, predicate)
  for _, str in ipairs(sequence) do
    if predicate(str) then
      return string.lower(str)
    end
  end
  return nil -- Return nil if no string satisfies the predicate.
end

-- Coroutine generator for powers of a base up to a limit.
function powers_generator(base, limit)
  return coroutine.create(function()
    local power = 1
    while power <= limit do
      coroutine.yield(power) -- Yield the current power.
      power = power * base -- Compute the next power.
    end
  end)
end

-- Chainable function that accumulates words into a sentence.
function say(word)
  if word == nil then
    return "" -- Return an empty string if no word is provided.
  end
  return function(next)
    if next == nil then
      return word -- Return the accumulated sentence when called without arguments.
    else
      return say(word .. " " .. next) -- Append the next word to the sentence.
    end
  end
end

-- Counts the number of meaningful lines in a file (non-empty, non-comment).
function meaningful_line_count(filename)
  local count = 0
  local file = io.open(filename, "r")
  if file == nil then
    error("No such file") -- Raise an error if the file doesn't exist.
  end
  for line in file:lines() do
    line = line:match("^%s*(.*)") -- Trim leading whitespace.
    if line ~= "" and line:sub(1, 1) ~= "#" then
      count = count + 1 -- Increment count for meaningful lines.
    end
  end
  file:close()
  return count
end

-- Defines the Quaternion class with arithmetic and utility methods.
Quaternion = (function(class)
  local meta = {
    __add = function(self, q)
      return class.new(
        self.a + q.a,
        self.b + q.b,
        self.c + q.c,
        self.d + q.d
      )
    end,
    __mul = function(self, q)
      return class.new(
        q.a * self.a - q.b * self.b - q.c * self.c - q.d * self.d,
        q.a * self.b + q.b * self.a - q.c * self.d + q.d * self.c,
        q.a * self.c + q.b * self.d + q.c * self.a - q.d * self.b,
        q.a * self.d - q.b * self.c + q.c * self.b + q.d * self.a
      )
    end,
    __eq = function(self, q)
      return self.a == q.a and self.b == q.b and self.c == q.c and self.d == q.d
    end,
    __tostring = function(self)
      local s = ""
      for i, c in ipairs(self:coefficients()) do
        if c ~= 0 then
          s = s .. (c < 0 and "-" or (s == "" and "" or "+")) -- Handle sign.
          s = s .. ((i ~= 1 and math.abs(c) == 1) and "" or tostring(math.abs(c))) -- Add coefficient.
          s = s .. ({"", "i", "j", "k"})[i] -- Append the correct unit.
        end
      end
      return s == "" and "0" or s
    end,
    __index = {
      coefficients = function(self)
        return {self.a, self.b, self.c, self.d} -- Return the components as a table.
      end,
      conjugate = function(self)
        return class.new(self.a, -self.b, -self.c, -self.d) -- Negate the imaginary parts.
      end
    },
  }
  class.new = function(a, b, c, d)
    return setmetatable({a = a, b = b, c = c, d = d}, meta)
  end
  return class
end)({})