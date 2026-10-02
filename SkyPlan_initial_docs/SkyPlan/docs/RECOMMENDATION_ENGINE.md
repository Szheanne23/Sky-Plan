# SkyPlan — Activity Recommendation Engine

## 1. Purpose

The recommendation engine is the core decision-support component of SkyPlan.

The proposal specifies a **rule-based** recommendation system using:
- weather conditions; and
- user-selected interest tags.

## 2. Inputs

### Weather Input
Potential weather inputs include:
- weather condition/category;
- temperature;
- precipitation/rain information;
- wind information;
- other forecast values available from the selected OpenWeatherMap service.

Only fields actually available and useful to the final API integration should be used.

### User Interest Input
The user's selected interest tags.

Examples of interests mentioned conceptually by the proposal include activities such as:
- jogging;
- hiking;
- picnics;
- sports.

These examples should not automatically become a fixed final activity catalog unless the project adopts them.

### Admin Rules
Administrators configure the recommendation rules used by the engine.

## 3. Conceptual Flow

```text
Weather Forecast
       |
       v
Weather Condition Evaluation
       |
       +-------------------+
       |                   |
       v                   v
 User Interests       Active Rules
       |                   |
       +---------+---------+
                 |
                 v
       Recommendation Engine
                 |
                 v
     Ranked/Filtered Activities
```

## 4. Rule Evaluation

A proposed rule can conceptually contain:

```text
IF
    weather condition satisfies condition
    AND optional weather threshold is satisfied
    AND activity matches user interest
THEN
    recommend activity
```

The exact rule syntax should be database-driven rather than hard-coded into UI components.

## 5. Indoor / Outdoor

The proposal specifically describes recommendations as suitable indoor or outdoor activities.

Activities should therefore have an indoor/outdoor classification.

## 6. Recommendation Result

A recommendation result should ideally contain:
- activity name;
- indoor/outdoor classification;
- short explanation;
- relevant weather reason;
- matched interest where useful.

The explanation is an implementation recommendation intended to make the recommendation understandable to users.

## 7. No Artificial Intelligence Requirement

The proposal describes a **rule-based** recommendation engine. An AI/ML recommendation system is not part of the stated baseline.

Do not introduce AI/ML merely to make the project appear more advanced unless the team explicitly decides to expand the scope.

## 8. Rule Management

Admins should be able to:
- view active rules;
- create rules;
- update rules;
- disable/remove rules.

The exact administration workflow should be finalized with the database design.

## 9. Conflict Handling

If multiple rules produce different recommendations:
- use rule priority or another deterministic mechanism;
- avoid duplicate recommendations;
- keep the result explainable.

The specific conflict strategy is an implementation decision.

## 10. Empty Results

If no configured rule matches:
- do not fabricate a recommendation;
- provide a clear fallback message;
- optionally provide a generic planning message if the project approves one.

## 11. Safety and Accuracy

Recommendations are activity-planning suggestions, not medical or emergency advice.

The system should avoid claiming that a weather condition guarantees safety. It should present forecast-based recommendations as guidance derived from available weather data and configured rules.
