'''
ad_engine.py
Advertisement Selection Engine that employs a Decision Network
to Maximize Expected Utility associated with different Decision
variables in a stochastic reasoning environment.
'''
import pandas as pd
import math
import itertools
import unittest
import os
from ad_agent import AdEngine
from ad_agent_queries import *
from constants import *
from grading_constants import *

class AdAgentGradingTests(unittest.TestCase):
    
    def test_do_op(self) -> None:
        ad_engine = AdEngine(DO_TEST_DATA, DO_TEST_STRUC, DO_TEST_DEC, DO_TEST_UTIL)
        evidence: dict[str, int] = {}
        decision = ad_engine.meu(evidence)
        self.assertAlmostEqual(83.85, decision[1], delta=0.01, msg="[X] If you're getting *close* to this score, it's probably because you're not using the do-operator for your inference queries")
    
    def test_meu_lecture_example_no_evidence(self) -> None:
        ad_engine = AdEngine(LECTURE_5_2_DATA, LECTURE_5_2_STRUC, LECTURE_5_2_DEC, LECTURE_5_2_UTIL)
        evidence: dict[str, int] = {}
        decision = ad_engine.meu(evidence)
        self.assertAlmostEqual(2.0, decision[1], delta=0.01)
        self.assertEqual({"D": 0}, decision[0])
     
    def test_meu_lecture_example_with_evidence(self) -> None:
        ad_engine = AdEngine(LECTURE_5_2_DATA, LECTURE_5_2_STRUC, LECTURE_5_2_DEC, LECTURE_5_2_UTIL)
        evidence: dict[str, int] = {"M": 0}
        decision = ad_engine.meu(evidence)
        self.assertAlmostEqual(2, decision[1], delta=0.01)
        self.assertEqual({"D": 1}, decision[0])
         
        evidence2: dict[str, int] = {"M": 1}
        decision2 = ad_engine.meu(evidence2)
        self.assertAlmostEqual(2.4, decision2[1], delta=0.01)
        self.assertEqual({"D": 0}, decision2[0])
         
    def test_vpi_lecture_example_no_evidence(self) -> None:
        ad_engine = AdEngine(LECTURE_5_2_DATA, LECTURE_5_2_STRUC, LECTURE_5_2_DEC, LECTURE_5_2_UTIL)
        evidence: dict[str, int] = {}
        vpi = ad_engine.vpi("M", evidence)
        self.assertAlmostEqual(0.24, vpi, delta=0.1)
     
    def test_meu_defendotron_no_evidence(self) -> None:
        ad_engine = AdEngine(ADBOT_DATA, ADBOT_STRUC, ADBOT_DEC, ADBOT_UTIL)
        evidence: dict[str, int] = {}
        decision = ad_engine.meu(evidence)
        self.assertAlmostEqual(746.72, decision[1], delta=0.01)
        self.assertEqual({"Ad1": 1, "Ad2": 0}, decision[0])
         
    def test_meu_defendotron_with_evidence(self) -> None:
        ad_engine = AdEngine(ADBOT_DATA, ADBOT_STRUC, ADBOT_DEC, ADBOT_UTIL)
        evidence: dict[str, int] = {"T": 0, "G": 0}
        decision = ad_engine.meu(evidence)
        self.assertAlmostEqual(796.82, decision[1], delta=0.01)
        self.assertEqual({"Ad1": 0, "Ad2": 0}, decision[0])
         
    def test_vpi_defendotron_no_evidence(self) -> None:
        ad_engine = AdEngine(ADBOT_DATA, ADBOT_STRUC, ADBOT_DEC, ADBOT_UTIL)
        evidence: dict[str, int] = {}
        vpi = ad_engine.vpi("G", evidence)
        self.assertAlmostEqual(20.77, vpi, delta=0.1)
         
        vpi2 = ad_engine.vpi("F", evidence)
        self.assertAlmostEqual(0, vpi2, delta=0.1)
         
    def test_vpi_defendotron_with_evidence(self) -> None:
        ad_engine = AdEngine(ADBOT_DATA, ADBOT_STRUC, ADBOT_DEC, ADBOT_UTIL)
         
        evidence: dict[str, int] = {"G": 1}
        vpi = ad_engine.vpi("P", evidence)
        self.assertAlmostEqual(0, vpi, delta=0.1)
         
        evidence2: dict[str, int] = {"H": 0, "T": 1, "P": 0}
        vpi = ad_engine.vpi("G", evidence2)
        self.assertAlmostEqual(66.76, vpi, delta=0.1)
    
    def test_most_likely_consumer_lecture_example(self) -> None:
        ad_engine = AdEngine(LECTURE_5_2_DATA, LECTURE_5_2_STRUC, LECTURE_5_2_DEC, LECTURE_5_2_UTIL)
        evidence: dict[str, int] = {}
        most_likely_consumer = ad_engine.most_likely_consumer(evidence)
        self.assertEqual({"C": 0, "M": 1}, most_likely_consumer)
        
        evidence2: dict[str, int] = {"C": 1}
        most_likely_consumer2 = ad_engine.most_likely_consumer(evidence2)
        self.assertEqual({"C": 1, "M": 1}, most_likely_consumer2)
        
    def test_most_likely_consumer_defendotron(self) -> None:
        ad_engine = AdEngine(ADBOT_DATA, ADBOT_STRUC, ADBOT_DEC, ADBOT_UTIL)
        evidence: dict[str, int] = {"G": 1, "P": 1, "A": 1}
        most_likely_consumer = ad_engine.most_likely_consumer(evidence)
        self.assertEqual({"S": 0, "I": 1, "F": 0, "T": 0, "H": 1, "G": 1, "P": 1, "A": 1}, most_likely_consumer)
        
    # Added grading tests
    # -----------------------------------------------------------------------------------------
    
    def test_meu_grading_do_op(self) -> None:
        ad_engine = AdEngine(GRADING_DATA, GRADING_STRUC, ["B"], GRADING_UTIL)
        evidence: dict[str, int] = {}
        decision = ad_engine.meu(evidence)
        self.assertAlmostEqual(21.29, decision[1], delta=0.01, msg="[X] If you're getting *close* to this score, it's probably because you're not using the do-operator for your inference queries")
    
    def test_meu_grading_no_evidence(self) -> None:
        ad_engine = AdEngine(GRADING_DATA, GRADING_STRUC, GRADING_DEC, GRADING_UTIL)
        evidence: dict[str, int] = {}
        decision = ad_engine.meu(evidence)
        self.assertAlmostEqual(23.57, decision[1], delta=0.01)
        self.assertEqual({"A": 1}, decision[0])
         
    def test_meu_grading_with_evidence(self) -> None:
        ad_engine = AdEngine(GRADING_DATA, GRADING_STRUC, GRADING_DEC, GRADING_UTIL)
        evidence: dict[str, int] = {"C": 2}
        decision = ad_engine.meu(evidence)
        self.assertAlmostEqual(12.38, decision[1], delta=0.01)
        self.assertEqual({"A": 0}, decision[0])
        
    def test_vpi_grading_no_evidence(self) -> None:
        ad_engine = AdEngine(GRADING_DATA, GRADING_STRUC, GRADING_DEC, GRADING_UTIL)
        evidence: dict[str, int] = {}
        decision = ad_engine.meu(evidence)
        vpi = ad_engine.vpi("B", evidence)
        self.assertAlmostEqual(1.66, vpi, delta=0.1)
        
        vpi2 = ad_engine.vpi("C", evidence)
        self.assertAlmostEqual(0, vpi2, delta=0.1)
        
    def test_vpi_grading_with_evidence(self) -> None:
        ad_engine = AdEngine(GRADING_DATA, GRADING_STRUC, GRADING_DEC, GRADING_UTIL)
        evidence: dict[str, int] = {"B": 0}
        decision = ad_engine.meu(evidence)
        vpi = ad_engine.vpi("C", evidence)
        self.assertAlmostEqual(0, vpi, delta=0.1)
        
    def test_most_likely_consumer_grading(self) -> None:
        ad_engine = AdEngine(GRADING_DATA, GRADING_STRUC, GRADING_DEC, GRADING_UTIL)
        evidence: dict[str, int] = {"A": 1, "B": 1, "C": 1}
        most_likely_consumer = ad_engine.most_likely_consumer(evidence)
        self.assertEqual({"A": 1, "B": 1, "C": 1, "D": 2}, most_likely_consumer)
        
        evidence2: dict[str, int] = {"A": 2, "B": 2, "C": 2, "D": 2}
        most_likely_consumer2 = ad_engine.most_likely_consumer(evidence2)
        self.assertEqual({"A": 2, "B": 2, "C": 2, "D": 2}, most_likely_consumer2)
        
    def test_ad_agent_queries_7_1(self) -> None:
        ad_agent = AdEngine(ADBOT_DATA, ADBOT_STRUC, ADBOT_DEC, ADBOT_UTIL)
        querier  = AdAgentQueries(ad_agent)
        self.assertAlmostEqual(20.779, querier.answer_7_1(), delta=0.01)
        
    def test_ad_agent_queries_7_2(self) -> None:
        ad_agent = AdEngine(ADBOT_DATA, ADBOT_STRUC, ADBOT_DEC, ADBOT_UTIL)
        querier  = AdAgentQueries(ad_agent)
        self.assertAlmostEqual(0.0, querier.answer_7_2(), delta=0.01)
        
    def test_ad_agent_queries_7_3(self) -> None:
        ad_agent = AdEngine(ADBOT_DATA, ADBOT_STRUC, ADBOT_DEC, ADBOT_UTIL)
        querier  = AdAgentQueries(ad_agent)
        self.assertEqual({"F": 0, "S": 0, "T": 1, "P": 1, "G": 1, "I": 1, "A": 0, "H": 1}, querier.answer_7_3())
        
if __name__ == '__main__':
    unittest.main()

