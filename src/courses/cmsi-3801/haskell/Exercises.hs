module Exercises
    ( change,
      firstThenApply,
      powers,
      meaningfulLineCount,
      Shape(..),
      BST(Empty),
      volume,
      surfaceArea,
      size,
      contains,
      insert,
      inorder
    ) where

import qualified Data.Map as Map
import Data.List(isPrefixOf, find)
import Data.Char(isSpace)

change :: Integer -> Either String (Map.Map Integer Integer)
change amount
    | amount < 0 = Left "amount cannot be negative"
    | otherwise = Right $ changeHelper [25, 10, 5, 1] amount Map.empty
        where
          changeHelper [] remaining counts = counts
          changeHelper (d:ds) remaining counts =
            changeHelper ds newRemaining newCounts
              where
                (count, newRemaining) = remaining `divMod` d
                newCounts = Map.insert d count counts

firstThenApply :: [a] -> (a -> Bool) -> (a -> b) -> Maybe b
firstThenApply xs predicate func =
    fmap func (find predicate xs) -- Use fmap for concise and expressive transformation.

powers :: Integer -> [Integer]
powers base = iterate (* base) 1 -- Generates an infinite list of powers of the base.

meaningfulLineCount :: FilePath -> IO Int
meaningfulLineCount filename = do
    contents <- readFile filename -- Read file contents as a single string.
    return $ length $ filter isMeaningfulLine (lines contents) -- Count meaningful lines.
  where
    -- A line is meaningful if it is not empty, not just whitespace, and does not start with '#'.
    isMeaningfulLine line = let trimmed = trim line in not (null trimmed) && not ("#" `isPrefixOf` trimmed)

    -- Removes leading and trailing whitespace.
    trim = reverse . dropWhile isSpace . reverse . dropWhile isSpace

data Shape = Sphere Double | Box Double Double Double
    deriving (Eq)

volume :: Shape -> Double
volume (Sphere r) = (4 / 3) * pi * (r ^ 3) -- Volume of a sphere: 4/3 * π * r³.
volume (Box w l d) = w * l * d -- Volume of a box: width * length * depth.

surfaceArea :: Shape -> Double
surfaceArea (Sphere r) = 4 * pi * (r ^ 2) -- Surface area of a sphere: 4 * π * r².
surfaceArea (Box w l d) = 2 * (w * l + w * d + l * d) -- Surface area of a box.

instance Show Shape where
    show (Sphere r) = "Sphere " ++ show r
    show (Box w l d) = "Box " ++ show w ++ " " ++ show l ++ " " ++ show d

data BST a = Empty | Node a (BST a) (BST a) deriving (Eq)

insert :: Ord a => a -> BST a -> BST a
insert x Empty = Node x Empty Empty -- Insert into an empty tree creates a new node.
insert x (Node y left right)
    | x < y     = Node y (insert x left) right -- Insert into the left subtree.
    | x > y     = Node y left (insert x right) -- Insert into the right subtree.
    | otherwise = Node y left right -- Duplicates are not inserted.

contains :: Ord a => a -> BST a -> Bool
contains _ Empty = False -- An empty tree contains no elements.
contains x (Node y left right)
    | x == y    = True -- Value found.
    | x < y     = contains x left -- Search in the left subtree.
    | otherwise = contains x right -- Search in the right subtree.

size :: BST a -> Int
size Empty = 0 -- An empty tree has size 0.
size (Node _ left right) = 1 + size left + size right -- Size is the sum of all nodes.

inorder :: BST a -> [a]
inorder Empty = [] -- An empty tree yields no elements.
inorder (Node x left right) = inorder left ++ [x] ++ inorder right -- Inorder traversal.

instance Show a => Show (BST a) where
    show Empty = "()" -- Empty tree is "()".
    show (Node x Empty Empty) = "(" ++ show x ++ ")" -- Leaf node.
    show (Node x left Empty) = "(" ++ show left ++ show x ++ ")" -- Left subtree only.
    show (Node x Empty right) = "(" ++ show x ++ show right ++ ")" -- Right subtree only.
    show (Node x left right) = "(" ++ show left ++ show x ++ show right ++ ")" -- Both subtrees.
