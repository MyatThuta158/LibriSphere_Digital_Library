# views.py
from django.shortcuts import render
from rest_framework.decorators import api_view
from django.http import JsonResponse
from rest_framework import status
from .models import Users, MembershipPlans, Subscriptions
from django.db.models import Count, F, DateField
from django.db import models  # import the whole models module
from django.db.models import Value  # Import Value for use in annotations
from sklearn.linear_model import LinearRegression

from django.db.models.functions import Cast, TruncDate
import pandas as pd
import numpy as np
import logging

# Prophet-related imports (for predict_new_members)
from prophet import Prophet
from prophet.diagnostics import cross_validation, performance_metrics
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

# XGBoost and scikit-learn imports (for membership subscriptions prediction)
from xgboost import XGBRegressor
from sklearn.metrics import r2_score as r2_score_xgb, mean_absolute_error as mae_xgb, mean_squared_error as mse_xgb

logger = logging.getLogger(__name__)

# @api_view(['GET'])
# def predict_new_members(request):
#     """
#     Forecast new member counts using Prophet.
#     (This function is assumed to work correctly.)
#     """
#     try:
#         # Aggregate historical data with daily counts
#         qs = (
#             Users.objects
#             .annotate(date=TruncDate('created_at'))
#             .values('date')
#             .annotate(count=Count('id'))
#             .order_by('date')
#         )
#         if not qs:
#             return JsonResponse({"error": "No historical data available"}, status=400)
        
#         # Convert query results to a DataFrame
#         data = pd.DataFrame(list(qs))
#         data = data.rename(columns={'date': 'ds', 'count': 'y'})
#         data['ds'] = pd.to_datetime(data['ds'])
#         data = data.set_index('ds').asfreq('D', fill_value=0).reset_index()
        
#         # Ensure we have enough data points
#         if len(data) < 28:
#             return JsonResponse({"error": "At least 28 days of data required"}, status=400)
        
#         # Optional log transformation to stabilize variance
#         data['y_log'] = np.log1p(data['y'])
        
#         # Feature engineering: add day of week and a flag for the start of month
#         data['day_of_week'] = data['ds'].dt.dayofweek
#         data['is_start_of_month'] = (data['ds'].dt.day <= 7).astype(int)
        
#         # Hyperparameter tuning: try candidate values for better performance
#         cps_values = [0.1, 0.5, 0.8]
#         seasonality_values = [5, 10, 15]
#         best_params = None
#         best_score = float('inf')
#         best_model = None
        
#         # Use cross-validation (with an initial training period of 28 days and a 14-day horizon)
#         for cps in cps_values:
#             for seasonality in seasonality_values:
#                 try:
#                     model = Prophet(
#                         daily_seasonality=False,
#                         weekly_seasonality=True,
#                         yearly_seasonality=False,
#                         seasonality_mode='additive',
#                         changepoint_prior_scale=cps,
#                         seasonality_prior_scale=seasonality,
#                         interval_width=0.95
#                     )
#                     model.add_regressor('day_of_week')
#                     model.add_regressor('is_start_of_month')
#                     model.add_country_holidays(country_name='US')
                    
#                     # Fit using the log-transformed target
#                     model.fit(data[['ds', 'y_log', 'day_of_week', 'is_start_of_month']].rename(columns={'y_log': 'y'}))
                    
#                     # Perform cross-validation on the log scale
#                     df_cv = cross_validation(model, initial='28 days', period='7 days', horizon='14 days', parallel="processes")
#                     df_p = performance_metrics(df_cv)
#                     score = df_p['mae'].mean()  # average MAE on log scale
                    
#                     if score < best_score:
#                         best_score = score
#                         best_params = {'changepoint_prior_scale': cps, 'seasonality_prior_scale': seasonality}
#                         best_model = model
                        
#                 except Exception as ex:
#                     logger.warning(f"Hyperparameter tuning failed for cps={cps}, seasonality={seasonality}: {ex}")
#                     continue
        
#         # Fallback to default settings if tuning did not yield a model
#         if best_model is None:
#             best_model = Prophet(
#                 daily_seasonality=False,
#                 weekly_seasonality=True,
#                 yearly_seasonality=False,
#                 seasonality_mode='additive',
#                 changepoint_prior_scale=0.5,
#                 seasonality_prior_scale=5,
#                 interval_width=0.95
#             )
#             best_model.add_regressor('day_of_week')
#             best_model.add_regressor('is_start_of_month')
#             best_model.add_country_holidays(country_name='US')
#             best_model.fit(data[['ds', 'y_log', 'day_of_week', 'is_start_of_month']].rename(columns={'y_log': 'y'}))
        
#         # Train final model on full data using the best hyperparameters
#         future = best_model.make_future_dataframe(periods=28, freq='D')
#         future['day_of_week'] = future['ds'].dt.dayofweek
#         future['is_start_of_month'] = (future['ds'].dt.day <= 7).astype(int)
#         forecast = best_model.predict(future)
        
#         # Ensure forecast has uncertainty interval columns
#         if 'yhat_lower' not in forecast.columns:
#             forecast['yhat_lower'] = forecast['yhat']
#         if 'yhat_upper' not in forecast.columns:
#             forecast['yhat_upper'] = forecast['yhat']
        
#         # Reverse the log transformation for predictions
#         forecast['yhat'] = np.expm1(forecast['yhat']).clip(lower=0).round().astype(int)
        
#         # Evaluate model performance on historical data (optional)
#         historical = forecast[forecast['ds'] <= data['ds'].max()]
#         metrics_df = pd.merge(data, historical[['ds', 'yhat']], on='ds', how='left')
#         mae_val = mean_absolute_error(metrics_df['y'], metrics_df['yhat'])
#         rmse_val = np.sqrt(mean_squared_error(metrics_df['y'], metrics_df['yhat']))
#         r2_val = r2_score(metrics_df['y'], metrics_df['yhat'])
        
#         # Calculate cumulative forecasts for the next 28 days
#         forecast_future = forecast[forecast['ds'] > data['ds'].max()]
#         if not forecast_future.empty:
#             cumulative = (forecast_future[['yhat', 'yhat_lower', 'yhat_upper']]
#                           .expanding()
#                           .sum()
#                           .astype(int)
#                           .reset_index(drop=True))
#             next_7_days = int(cumulative.iloc[6]['yhat']) if len(cumulative) >= 7 else None
#             next_14_days = int(cumulative.iloc[13]['yhat']) if len(cumulative) >= 14 else None
#             next_28_days = int(cumulative.iloc[-1]['yhat'])
#             upper_28_days = int(cumulative.iloc[-1]['yhat_upper'])
#             lower_28_days = int(cumulative.iloc[-1]['yhat_lower'])
#         else:
#             next_7_days = next_14_days = next_28_days = upper_28_days = lower_28_days = None
        
#         result = {
#             "metrics": {
#                 "mae": round(mae_val, 2),
#                 "accuracy": round(r2_val, 2),
#                 "best_params": best_params
#             },
#             "predictions": {
#                 "next_7_days": next_7_days,
#                 "next_14_days": next_14_days,
#                 "next_28_days": next_28_days
#             },
#             "confidence_interval": {
#                 "upper_28_days": upper_28_days,
#                 "lower_28_days": lower_28_days
#             },
#             "last_training_date": data['ds'].max().strftime("%Y-%m-%d"),
#             "model_version": "prophet_tuned_v1"
#         }
#         return JsonResponse(result)
        
#     except Exception as e:
#         logger.error(f"Forecasting error: {str(e)}", exc_info=True)
#         return JsonResponse(
#             {"error": "Prediction failed", "details": str(e)},
#             status=500
#         )



@api_view(['GET'])
def predict_new_members(request):
    """
    Forecast new user signups using an XGBRegressor with lag and rolling features,
    plus simple grid search for hyperparameter tuning.
    Returns cumulative forecasts for the next 7, 14, and 28 days.
    """
    try:
        # Query daily counts of new users
        qs = (
            Users.objects
            .annotate(date=TruncDate('created_at'))
            .values('date')
            .annotate(count=Count('id'))
            .order_by('date')
        )
        if not qs or len(qs) < 28:
            return JsonResponse({"error": "At least 28 days of signup data required"}, status=400)

        # Prepare DataFrame
        data = pd.DataFrame(list(qs)).rename(columns={'date': 'ds', 'count': 'y'})
        data['ds'] = pd.to_datetime(data['ds'])
        data = data.set_index('ds').asfreq('D', fill_value=0).reset_index()

        # Feature engineering
        data['t'] = (data['ds'] - data['ds'].min()).dt.days
        data['day_of_week'] = data['ds'].dt.dayofweek
        data['is_start_of_month'] = (data['ds'].dt.day <= 7).astype(int)
        # Lag and rolling features
        data['lag_1'] = data['y'].shift(1).fillna(0)
        data['rolling_mean_7'] = data['y'].rolling(window=7).mean().fillna(method='bfill')
        data = data.dropna().reset_index(drop=True)

        # Define features and target
        feature_cols = ['t', 'day_of_week', 'is_start_of_month', 'lag_1', 'rolling_mean_7']
        X = data[feature_cols].values
        y = data['y'].values

        # Hyperparameter grid
        param_grid = {
            'n_estimators': [50, 100, 200],
            'max_depth': [3, 5, 7],
            'learning_rate': [0.01, 0.05, 0.1]
        }

        best_score = -np.inf
        best_params = {}
        best_model = None
        # Manual grid search
        for n_est in param_grid['n_estimators']:
            for depth in param_grid['max_depth']:
                for lr in param_grid['learning_rate']:
                    model = XGBRegressor(
                        n_estimators=n_est,
                        max_depth=depth,
                        learning_rate=lr,
                        objective='reg:squarederror',
                        random_state=42
                    )
                    model.fit(X, y)
                    preds = model.predict(X)
                    r2 = r2_score(y, preds)
                    if r2 > best_score:
                        best_score = r2
                        best_params = {'n_estimators': n_est, 'max_depth': depth, 'learning_rate': lr}
                        best_model = model

        # Forecast future dates
        last_date = data['ds'].max()
        future_dates = pd.date_range(start=last_date + pd.Timedelta(days=1), periods=28, freq='D')
        future_df = pd.DataFrame({'ds': future_dates})
        future_df['t'] = (future_df['ds'] - data['ds'].min()).dt.days
        future_df['day_of_week'] = future_df['ds'].dt.dayofweek
        future_df['is_start_of_month'] = (future_df['ds'].dt.day <= 7).astype(int)
        # Use last known lag and rolling
        last_lag = data.iloc[-1]['y']
        last_roll = data['y'].rolling(window=7).mean().iloc[-1]
        future_df['lag_1'] = last_lag
        future_df['rolling_mean_7'] = last_roll

        X_future = future_df[feature_cols].values
        yhat = best_model.predict(X_future)
        yhat = np.maximum(yhat, 0).round().astype(int)
        forecast_df = future_df.copy()
        forecast_df['yhat'] = yhat

        # Cumulative sums
        cum = forecast_df['yhat'].cumsum()
        next_7 = int(cum.iloc[6]) if len(cum) >= 7 else None
        next_14 = int(cum.iloc[13]) if len(cum) >= 14 else None
        next_28 = int(cum.iloc[-1])

        # Evaluate on historical
        hist_preds = best_model.predict(X)
        mae_val = mean_absolute_error(y, hist_preds)
        r2_val = best_score

        response = {
            "metrics": {"mae": round(mae_val, 2), "r2": round(r2_val, 2), "best_params": best_params},
            "predictions": {"next_7_days": next_7, "next_14_days": next_14, "next_28_days": next_28},
            "last_training_date": last_date.strftime("%Y-%m-%d"),
            "model_version": "xgb_new_members_v1"
        }
        return JsonResponse(response)

    except Exception as e:
        logger.error(f"XGB forecasting error: {str(e)}", exc_info=True)
        return JsonResponse({"error": "Prediction failed", "details": str(e)}, status=500)


@api_view(['GET'])
def predict_membership_subscriptions(request):
    """
    Forecast membership subscriptions per plan using an enhanced XGBoost model.
    The model now uses admin approved date, additional lag features, and rolling statistics
    for improved accuracy, and it includes a simple grid search for hyperparameter tuning.
    
    Returns cumulative forecasts for the next 7, 14, and 28 days.
    """
    try:
        results = {}
        plans = MembershipPlans.objects.all()
        
        # Define parameter grid for tuning
        param_grid = {
            'n_estimators': [50, 100],
            'max_depth': [3, 5],
            'learning_rate': [0.05, 0.1]
        }
        
        for plan in plans:
            qs = (
                Subscriptions.objects.filter(
                    membership_plans_id=plan.id,
                    paymentstatus='Approved'
                )
                .exclude(adminapproveddate__isnull=True)
                .annotate(date=TruncDate('adminapproveddate'))
                .values('date')
                .annotate(count=Count('id'))
                .order_by('date')
            )
            
            if not qs or len(qs) < 28:
                results[plan.planname] = {
                    "error": "At least 28 days of approved subscriptions required"
                }
                continue
            
            # Convert to DataFrame and ensure daily frequency
            data = pd.DataFrame(list(qs)).rename(columns={'date': 'ds', 'count': 'y'})
            data['ds'] = pd.to_datetime(data['ds'])
            data = data.set_index('ds').asfreq('D', fill_value=0).reset_index()
            
            # Basic date features
            data['t'] = (data['ds'] - data['ds'].min()).dt.days
            data['day_of_week'] = data['ds'].dt.dayofweek
            data['is_start_of_month'] = (data['ds'].dt.day <= 7).astype(int)
            data['month'] = data['ds'].dt.month
            data['day_of_month'] = data['ds'].dt.day
            
            # Add lag and rolling features (using lag of 1 and 7-day rolling mean)
            data['lag_1'] = data['y'].shift(1).fillna(0)
            data['rolling_mean_7'] = data['y'].rolling(window=7).mean().fillna(method='bfill')
            
            # Drop initial row if necessary
            data = data.dropna().reset_index(drop=True)
            
            # Define features and target
            feature_cols = ['t', 'day_of_week', 'is_start_of_month', 'month', 'day_of_month', 'lag_1', 'rolling_mean_7']
            X = data[feature_cols].values
            y = data['y'].values
            
            # Simple grid search for best hyperparameters on training data
            best_score = -np.inf
            best_params = {}
            best_model = None
            for n_est in param_grid['n_estimators']:
                for depth in param_grid['max_depth']:
                    for lr in param_grid['learning_rate']:
                        model = XGBRegressor(
                            n_estimators=n_est,
                            max_depth=depth,
                            learning_rate=lr,
                            objective='reg:squarederror',
                            random_state=42
                        )
                        model.fit(X, y)
                        preds = model.predict(X)
                        r2 = r2_score(y, preds)
                        if r2 > best_score:
                            best_score = r2
                            best_params = {'n_estimators': n_est, 'max_depth': depth, 'learning_rate': lr}
                            best_model = model
            
            # Forecast for next 28 days
            last_date = data['ds'].max()
            future_dates = pd.date_range(start=last_date + pd.Timedelta(days=1), periods=28, freq='D')
            future_df = pd.DataFrame({'ds': future_dates})
            future_df['t'] = (future_df['ds'] - data['ds'].min()).dt.days
            future_df['day_of_week'] = future_df['ds'].dt.dayofweek
            future_df['is_start_of_month'] = (future_df['ds'].dt.day <= 7).astype(int)
            future_df['month'] = future_df['ds'].dt.month
            future_df['day_of_month'] = future_df['ds'].dt.day
            # For lag and rolling features, use the last known values
            last_lag = data.iloc[-1]['y']
            last_rolling = data['y'].rolling(window=7).mean().iloc[-1]
            future_df['lag_1'] = last_lag  # A simplification; ideally update iteratively.
            future_df['rolling_mean_7'] = last_rolling
            
            X_future = future_df[feature_cols].values
            future_preds = best_model.predict(X_future)
            future_preds = np.maximum(future_preds, 0).round().astype(int)
            forecast_df = future_df.copy()
            forecast_df['yhat'] = future_preds
            
            # Compute cumulative forecasts
            cumulative = forecast_df['yhat'].cumsum()
            next_7_days = int(cumulative.iloc[6]) if len(cumulative) >= 7 else None
            next_14_days = int(cumulative.iloc[13]) if len(cumulative) >= 14 else None
            next_28_days = int(cumulative.iloc[-1])
            
            results[plan.planname] = {
                "metrics": {
                    "mae": round(mean_absolute_error(y, best_model.predict(X)), 2),
                    "accuracy": round(best_score, 2),
                    "best_params": best_params
                },
                "predictions": {
                    "next_7_days": next_7_days,
                    "next_14_days": next_14_days,
                    "next_28_days": next_28_days
                },
                "last_training_date": data['ds'].max().strftime("%Y-%m-%d"),
                "data_points_used": len(data),
                "model_version": "xgb_regressor_v2"
            }
        
        return JsonResponse(results)
    
    except Exception as e:
        logger.error(f"Forecasting error: {str(e)}", exc_info=True)
        return JsonResponse(
            {"error": "Prediction failed", "details": str(e)},
            status=500
        )
