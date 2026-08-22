'''
Constants to be used across various Ad Agent and Decision Network
tests, including network structure configurations and test file locations.

[!] Feel free to edit this file at will
[!] Note: any data frame in here should not be modified!
'''

import pandas as pd

# Grading Example
# -----------------------------------------------------------------------------------------
GRADING_DATA  = pd.read_csv("../dat/hw2_grading.csv")
GRADING_STRUC = [("A", "C"), ("A", "B"), ("C", "D"), ("B", "D")]
GRADING_DEC   = ["A"]
GRADING_UTIL  = {"D": {0: 10, 1: 20, 2: 30}}