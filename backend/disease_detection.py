import numpy as np
import pandas as pd

import disease_ml


def get_dna_prs(features):

    prs_values = {}

    features['risk_allele_frequency'] = ((features['allele1'] == features['risk_allele']).astype(float) + (features['allele2'] == features['risk_allele']).astype(float))

    refined_features = features.dropna(subset=['odds_ratio']).copy()
    refined_features['mrs'] = features['risk_allele_frequency'] * np.log(features['odds_ratio'])

    prs_values = refined_features.groupby('disease_name')['mrs'].sum().to_dict()
    return prs_values


def get_genetic_risk(features, prs_values):

    final_features = pd.DataFrame()
    final_features['key'] = features['rsid']+ "_" + features['disease_name']

    final_features['risk_allele_frequency'] = features['risk_allele_frequency'] / 2

    final_features = final_features.transpose()
    final_features.columns = final_features.iloc[0]
    final_features = final_features.drop(final_features.index[0]).reset_index(drop=True)

    genetic_risk = disease_ml.model_output(final_features)
    return genetic_risk


def get_environmental_risk(temperature, humidity, aqi):
    
    parameters = {
        "Alzheimer's Disease": {
            "temperature": 24,
            "humidity": 40,
            "aqi": 2,
            "weights": [0.4, 0.2, 0.4]
        },
        "Asthma": {
            "temperature": 20,
            "humidity": 40,
            "aqi": 1,
            "weights": [0.3, 0.5, 0.2]
        },
        "Breast Cancer": {
            "temperature": 26,
            "humidity": 40,
            "aqi": 1,
            "weights": [0.4, 0.2, 0.6]
        },
        "Coronary Artery Disease": {
            "temperature": 27,
            "humidity": 50,
            "aqi": 2,
            "weights": [0.5, 0.3, 0.2]
        },
        "Diabetes Mellitus Type 1": {
            "temperature": 20,
            "humidity": 30,
            "aqi": 1,
            "weights": [0.4, 0.4, 0.2]
        },
        "Diabetes Mellitus Type 2": {
            "temperature": 20,
            "humidity": 35,
            "aqi": 1,
            "weights": [0.4, 0.5, 0.1]
        },
        "Ischemic Stroke": {
            "temperature": 20,
            "humidity": 40,
            "aqi": 1,
            "weights": [0.4, 0.4, 0.2]
        },
        "Lung Carcinoma": {
            "temperature": 21,
            "humidity": 45,
            "aqi": 1,
            "weights": [0.3, 0.3, 0.4]
        },
        "Parkinson's Disease": {
            "temperature": 18,
            "humidity": 40,
            "aqi": 1,
            "weights": [0.4, 0.4, 0.2]
        },
        "Pulmonary Fibrosis": {
            "temperature": 20,
            "humidity": 40,
            "aqi": 1,
            "weights": [0.3, 0.4, 0.3]
        }
    }

    risks = {}
    for disease in parameters:
        temperature_risk = min((temperature - parameters[disease]["temperature"])/(45 - parameters[disease]["temperature"]), 0.9999)
        humidity_risk = min((humidity - parameters[disease]["humidity"])/(85 - parameters[disease]["humidity"]), 0.9999)
        aqi_risk = (aqi - 1)/5
        risks[disease] = parameters[disease]["weights"][0]*temperature_risk + parameters[disease]["weights"][1]*humidity_risk + parameters[disease]["weights"][2]*aqi_risk
    
    return risks


def get_lifestyle_risk(diet, drink, smoke, exercise, sleep):
    
    weights = {
        "Alzheimer's Disease": [0.3, 0.1, 0.05, 0.2, 0.35],
        "Asthma": [0.2, 0.15, 0.25, 0.2, 0.2],
        "Breast Cancer": [0.35, 0.1, 0.2, 0.15, 0.2],
        "Coronary Artery Disease": [0.25, 0.2, 0.3, 0.15, 0.1],
        "Diabetes Mellitus Type 1": [0.3, 0.05, 0.05, 0.35, 0.25],
        "Diabetes Mellitus Type 2": [0.4, 0.1, 0.1, 0.25, 0.15],
        "Ischemic Stroke": [0.25, 0.15, 0.3, 0.2, 0.1],
        "Lung Carcinoma": [0.15, 0.1, 0.5, 0.15, 0.1],
        "Parkinson's Disease": [0.3, 0.1, 0.05, 0.2, 0.35],
        "Pulmonary Fibrosis": [0.2, 0.1, 0.4, 0.15, 0.15]
    }

    risks = {}
    for disease in weights:
        diet_risk = diet
        drink_risk = drink
        smoke_risk = smoke
        inactivity_risk = max((10 - exercise)/10, 0)
        sleep_risk = min(abs(sleep - 7)/4, 0.9999)
        risks[disease] = weights[disease][0]*diet_risk + weights[disease][1]*drink_risk + weights[disease][2]*smoke_risk + weights[disease][3]*inactivity_risk + weights[disease][4]*sleep_risk
        
    return risks


def get_disease_risk(genetic_risk, environmental_risk, lifestyle_risk):

    weights = {
        "Alzheimer's Disease": [0.5, 0.2, 0.3],
        "Asthma": [0.2, 0.6, 0.2],
        "Breast Cancer": [0.4, 0.3, 0.3],
        "Coronary Artery Disease": [0.3, 0.3, 0.4],
        "Diabetes Mellitus Type 1": [0.6, 0.2, 0.2],
        "Diabetes Mellitus Type 2": [0.2, 0.2, 0.6],
        "Ischemic Stroke": [0.3, 0.3, 0.4],
        "Lung Carcinoma": [0.2, 0.5, 0.3],
        "Parkinson's Disease": [0.6, 0.2, 0.2],
        "Pulmonary Fibrosis": [0.3, 0.5, 0.2]
    }

    disease_risks = {}
    for disease in weights:
        disease_risks[disease] = weights[disease][0]*genetic_risk[disease] + weights[disease][1]*environmental_risk[disease] + weights[disease][2]*lifestyle_risk[disease]
    
    return disease_risks
