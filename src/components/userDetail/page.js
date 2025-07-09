import React from "react";
import { Box, Typography, Grid, Paper, Divider } from "@mui/material";

const UserDetail = ({ user }) => {
  const { details, mobileNumber } = user;

  return (
    <Box sx={{ p: 4, mx: "auto" }}>
      <Grid container spacing={3}>
        {/* Personal Info */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" gutterBottom style={{ color: "#2A84EB" }}>
              Personal Info
            </Typography>
            <Typography>
              <strong>Name:</strong> {details.name}
            </Typography>
            <Typography>
              <strong>Gender:</strong> {details.gender}
            </Typography>
            <Typography>
              <strong>Date of Birth:</strong> {new Date(details.dob).toLocaleDateString()}
            </Typography>
            <Typography>
              <strong>Mobile:</strong> {mobileNumber}
            </Typography>
          </Paper>
        </Grid>

        {/* Body Metrics */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" gutterBottom style={{ color: "#2A84EB" }}>
              Body Metrics
            </Typography>
            <Typography>
              <strong>Height:</strong> {details.height?.feet}ft {details.height?.inches}in (
              {details.height?.centimeters} cm)
            </Typography>
            <Typography>
              <strong>Weight:</strong> {details.weight?.pounds} lbs ({details.weight?.grams / 1000}{" "}
              kg)
            </Typography>
            <Typography>
              <strong>Desired Weight:</strong> {details.desiredWeight?.pounds} lbs (
              {details.desiredWeight?.grams / 1000} kg)
            </Typography>
            <Typography>
              <strong>Metric:</strong> {details.metric}
            </Typography>
          </Paper>
        </Grid>

        {/* Goals & Fitness */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 3, height: "240px" }}>
            <Typography variant="h6" gutterBottom style={{ color: "#2A84EB" }}>
              Goals & Fitness
            </Typography>
            <Typography>
              <strong>Goal:</strong> {details.goal?.replace(/_/g, " ")}
            </Typography>
            <Typography>
              <strong>Diet Type:</strong> {details.diet}
            </Typography>
            <Typography>
              <strong>Workouts/Week:</strong> {details.workoutsPerWeek}
            </Typography>
            <Typography>
              <strong>Weekly Weight Change:</strong> {details.weightChangePerWeek} kg
            </Typography>
          </Paper>
        </Grid>

        {/* Motivation & Source */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" gutterBottom style={{ color: "#2A84EB" }}>
              Motivation
            </Typography>
            <Typography>
              <strong>Accomplishment Goal:</strong> {details.accomplishmentGoal?.replace(/_/g, " ")}
            </Typography>
            <Typography>
              <strong>Goal Hinderance:</strong> {details.goalHinderance?.replace(/_/g, " ")}
            </Typography>
            <Typography>
              <strong>Referral Source:</strong> {details.referSource}
            </Typography>
            <Typography>
              <strong>Health Score:</strong> {details.healthScore}/10
            </Typography>
          </Paper>
        </Grid>

        {/* Nutrition Recommendation */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" gutterBottom style={{ color: "#2A84EB" }}>
              Daily Nutrition Recommendation
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} md={3}>
                <Typography>
                  <strong>Calories:</strong> {details.dailyRecommendation?.calories} kcal
                </Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography>
                  <strong>Carbs:</strong> {details.dailyRecommendation?.carbs} g
                </Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography>
                  <strong>Protein:</strong> {details.dailyRecommendation?.protein} g
                </Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography>
                  <strong>Fats:</strong> {details.dailyRecommendation?.fats} g
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserDetail;
