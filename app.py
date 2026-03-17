# -*- coding: utf-8 -*-
"""
app.py -- SmartEduCare Backend API
Flask server powering the React frontend Career Advisor feature.

Endpoints:
  POST /analyze  -- resume + job description -> score, skills, suggestions
  GET  /health   -- uptime check
  GET  /         -- welcome message
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import re

from parsing        import extract_text
from skills         import (
    extract_skills,
    SKILL_TO_ROLES,
    LEARNING_PATHS,
    PROJECT_IDEAS,
    GENERIC_CAREER_TIPS,
    get_skill_weight,
)
from fit_classifier import AdvancedFitClassifier

app = Flask(__name__)

CORS(app, resources={
    r"/*": {
        ""origins": "*",
        ],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"],
    }
})

os.makedirs("uploads", exist_ok=True)
classifier = AdvancedFitClassifier()


def predict_roles(resume_skills):
    role_scores = {}
    for skill in resume_skills:
        if skill in SKILL_TO_ROLES:
            weight = get_skill_weight(skill)
            for role in SKILL_TO_ROLES[skill]:
                role_scores[role] = role_scores.get(role, 0) + weight
    sorted_roles = sorted(role_scores, key=role_scores.get, reverse=True)
    return sorted_roles[:5]


def generate_suggestions(resume_skills, job_skills, resume_text="", job_text=""):
    missing_skills = [s for s in job_skills if s not in resume_skills]

    # 1. Skill gap analysis
    gap_analysis = []
    for skill in missing_skills[:6]:
        gap_analysis.append("Missing skill: " + skill.title())
    extra_skills = [s for s in resume_skills if s not in job_skills]
    if extra_skills:
        top_extra = extra_skills[:2]
        gap_analysis.append(
            "Bonus skills (not in JD but valuable): " +
            ", ".join(s.title() for s in top_extra)
        )

    # 2. Recommended learning
    recommended_learning = []
    for skill in missing_skills:
        if skill in LEARNING_PATHS:
            recommended_learning.extend(LEARNING_PATHS[skill])
    seen_lr = set()
    unique_learning = []
    for item in recommended_learning:
        if item not in seen_lr:
            seen_lr.add(item)
            unique_learning.append(item)
    unique_learning = unique_learning[:6]
    if not unique_learning:
        unique_learning = [
            "Take relevant online courses on Coursera or Udemy",
            "Follow official documentation and build mini-projects",
            "Join a study group or Discord community for your target stack",
        ]

    # 3. Suggested projects
    project_suggestions = []
    for skill in missing_skills + resume_skills:
        if skill in PROJECT_IDEAS:
            project_suggestions.extend(PROJECT_IDEAS[skill])
    seen_proj = set()
    unique_projects = []
    for item in project_suggestions:
        if item not in seen_proj:
            seen_proj.add(item)
            unique_projects.append(item)
    unique_projects = unique_projects[:5]
    if not unique_projects:
        unique_projects = [
            "Build a full-stack web application with authentication",
            "Create a data analysis dashboard and publish on GitHub",
            "Develop an AI-powered recommendation system",
        ]

    # 4. Career roles
    career_roles = predict_roles(resume_skills)
    if not career_roles:
        career_roles = ["Software Developer", "Data Analyst", "IT Specialist"]

    # 5. Career growth tips
    growth_tips = []
    if "machine learning" in resume_skills or "deep learning" in resume_skills:
        growth_tips.append("Participate in Kaggle competitions to sharpen ML skills")
    if any(s in resume_skills for s in ["javascript", "react", "typescript"]):
        growth_tips.append("Build modern web apps and share them on dev.to or Hashnode")
    if "python" in resume_skills:
        growth_tips.append("Contribute to Python open-source projects on GitHub")
    if any(s in missing_skills for s in ["aws", "docker", "kubernetes", "cloud"]):
        growth_tips.append("Learn cloud deployment to increase your market value")
    if any(s in resume_skills for s in ["verilog", "vhdl", "asic", "fpga"]):
        growth_tips.append("Publish your RTL designs on GitHub with a short blog post")
    if "figma" in resume_skills or "ux design" in resume_skills:
        growth_tips.append("Add case studies with before/after metrics to your design portfolio")
    if "product management" in resume_skills:
        growth_tips.append("Write a product teardown and share it on LinkedIn")
    for tip in GENERIC_CAREER_TIPS:
        if tip not in growth_tips:
            growth_tips.append(tip)
    growth_tips = growth_tips[:5]

    return {
        "skill_gap_analysis":   gap_analysis[:6],
        "recommended_learning": unique_learning[:6],
        "suggested_projects":   unique_projects[:5],
        "career_roles":         career_roles[:5],
        "career_growth_tips":   growth_tips[:5],
    }


@app.route("/analyze", methods=["POST"])
def analyze():
    try:
        resume_file = request.files.get("resume")
        job_file    = request.files.get("job")

        if not resume_file or not job_file:
            return jsonify({
                "success": False,
                "error": "Both 'resume' and 'job' files are required.",
            }), 400

        allowed_ext = {".pdf", ".docx", ".doc", ".txt", ".text"}
        for f in (resume_file, job_file):
            ext = os.path.splitext((f.filename or "").lower())[1]
            if ext and ext not in allowed_ext:
                return jsonify({
                    "success": False,
                    "error": "Unsupported file type '" + ext + "'. Please upload PDF, DOCX, or TXT.",
                }), 415

        try:
            resume_text = extract_text(resume_file)
        except ValueError as e:
            return jsonify({"success": False, "error": "Resume: " + str(e)}), 422

        try:
            job_text = extract_text(job_file)
        except ValueError as e:
            return jsonify({"success": False, "error": "Job description: " + str(e)}), 422

        resume_skills = extract_skills(resume_text)
        job_skills    = extract_skills(job_text)

        skill_weights = {s: get_skill_weight(s) for s in job_skills}
        detail = classifier.get_detailed_scores(
            resume_text, job_text,
            resume_skills, job_skills,
            skill_weights,
        )
        score = detail["total_score"]

        suggestions = generate_suggestions(
            resume_skills, job_skills,
            resume_text, job_text,
        )

        return jsonify({
            "success":       True,
            "score":         score,
            "resume_skills": resume_skills,
            "job_skills":    job_skills,
            "score_detail": {
                "skill_overlap_pct":   detail["skill_overlap_pct"],
                "text_similarity_pct": detail["text_similarity_pct"],
                "content_bonus_pct":   detail["content_bonus_pct"],
            },
            "suggestions": suggestions,
        })

    except Exception as e:
        app.logger.exception("Unexpected error in /analyze")
        return jsonify({
            "success": False,
            "error": "An unexpected server error occurred. Please try again.",
        }), 500


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "service": "SmartEduCare API"})


@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "SmartEduCare Career Advisor API is running.",
        "endpoints": {
            "POST /analyze": "Analyze resume vs job description",
            "GET  /health":  "Health check",
        }
    })


if __name__ == "__main__":
    app.run(debug=True, port=5000, host="0.0.0.0")