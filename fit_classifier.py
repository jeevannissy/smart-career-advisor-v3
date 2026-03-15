# -*- coding: utf-8 -*-
"""
fit_classifier.py -- Weighted resume-job fit scoring
No external ML libraries required -- pure Python.

Score formula (0-100):
  40% -- Weighted skill overlap
  35% -- TF-IDF cosine similarity on full text
  25% -- Key phrase / section bonus
"""

import re
import math


class AdvancedFitClassifier:

    SECTION_KEYWORDS = {
        "experience", "project", "education", "certification",
        "achievement", "responsible", "developed", "designed",
        "implemented", "led", "managed", "built", "deployed",
        "improved", "optimised", "collaborated", "published",
    }

    def __init__(self):
        pass

    def predict_fit(self, resume_text, job_text,
                    resume_skills=None, job_skills=None, skill_weights=None):
        if not resume_text or not job_text:
            return 0
        sw = skill_weights or {}
        skill_score = self._weighted_skill_score(
            resume_skills or [], job_skills or [], sw) * 40
        cosine = self._tfidf_cosine(resume_text, job_text) * 35
        bonus  = self._section_bonus(resume_text, job_text) * 25
        raw = skill_score + cosine + bonus
        score = min(int(raw * 1.05), 98)
        return max(score, 5)

    def get_detailed_scores(self, resume_text, job_text,
                             resume_skills, job_skills, skill_weights=None):
        sw = skill_weights or {}
        skill_raw  = self._weighted_skill_score(resume_skills, job_skills, sw)
        cosine_raw = self._tfidf_cosine(resume_text, job_text)
        bonus_raw  = self._section_bonus(resume_text, job_text)
        matched = [s for s in resume_skills if s in job_skills]
        missing = [s for s in job_skills   if s not in resume_skills]
        total = min(int((skill_raw * 40 + cosine_raw * 35 + bonus_raw * 25) * 1.05), 98)
        total = max(total, 5)
        return {
            "total_score":         total,
            "skill_overlap_pct":   round(skill_raw  * 100, 1),
            "text_similarity_pct": round(cosine_raw * 100, 1),
            "content_bonus_pct":   round(bonus_raw  * 100, 1),
            "matched_skills":      matched,
            "missing_skills":      missing,
        }

    def _weighted_skill_score(self, resume_skills, job_skills, weights):
        if not job_skills:
            return 0.0
        DEFAULT_W = 1.0
        total_weight   = sum(weights.get(s, DEFAULT_W) for s in job_skills)
        matched_weight = sum(
            weights.get(s, DEFAULT_W) for s in job_skills if s in resume_skills)
        if total_weight == 0:
            return 0.0
        raw = matched_weight / total_weight
        return min(raw + math.log1p(raw) * 0.12, 1.0)

    @staticmethod
    def _tokenise(text):
        text = text.lower()
        text = re.sub(r"[^a-z0-9\s]", " ", text)
        tokens = text.split()
        STOP = {
            "the","and","for","are","was","were","has","have",
            "with","this","that","from","they","their","you",
            "our","your","all","will","not","but","can","its",
            "been","also","more","into","than","then","when",
            "which","who","what","how",
        }
        return [t for t in tokens if t not in STOP and len(t) > 1]

    def _tf(self, tokens):
        freq = {}
        for t in tokens:
            freq[t] = freq.get(t, 0) + 1
        total = len(tokens) or 1
        return {t: c / float(total) for t, c in freq.items()}

    def _tfidf_cosine(self, text1, text2):
        tokens1 = self._tokenise(text1)
        tokens2 = self._tokenise(text2)
        if not tokens1 or not tokens2:
            return 0.0
        tf1 = self._tf(tokens1)
        tf2 = self._tf(tokens2)
        vocab = set(tf1) | set(tf2)
        dot  = sum(tf1.get(w, 0) * tf2.get(w, 0) for w in vocab)
        mag1 = math.sqrt(sum(v ** 2 for v in tf1.values()))
        mag2 = math.sqrt(sum(v ** 2 for v in tf2.values()))
        if mag1 == 0 or mag2 == 0:
            return 0.0
        return dot / (mag1 * mag2)

    def _section_bonus(self, resume_text, job_text):
        r = set(re.findall(r"\b\w+\b", resume_text.lower()))
        j = set(re.findall(r"\b\w+\b", job_text.lower()))
        shared = r & j & self.SECTION_KEYWORDS
        return min(len(shared) / 10.0, 1.0)