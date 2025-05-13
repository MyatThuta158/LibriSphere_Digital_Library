import pandas as pd
from prophet import Prophet
from sklearn.metrics import r2_score
from django.db.models import Count
from django.db.models.functions import TruncDate
from .models import User

def predict_members():
    # Get historical data
    queryset = User.objects.annotate(date=TruncDate('created_at')).values('date').annotate(count=Count('id')).order_by('date')
    
    if not queryset:
        return None, 0.0
    
    df = pd.DataFrame(list(queryset))
    df = df.rename(columns={'date': 'ds', 'count': 'y'})
    
    # Split data (last 25% as test)
    split_idx = int(len(df) * 0.75)
    train = df.iloc[:split_idx]
    test = df.iloc[split_idx:]
    
    # Train initial model
    model = Prophet()
    model.fit(train)
    
    # Create future dates including test period
    future = model.make_future_dataframe(periods=len(test))
    forecast = model.predict(future)
    
    # Calculate accuracy
    merged = forecast.set_index('ds')[['yhat']].join(df.set_index('ds'))
    merged = merged.dropna()
    r2 = r2_score(merged['y'], merged['yhat'])
    
    if r2 < 0.7:
        return None, r2
    
    # Final model with full data
    final_model = Prophet()
    final_model.fit(df)
    
    # Predict next 28 days
    future = final_model.make_future_dataframe(periods=28)
    forecast = final_model.predict(future)
    
    # Get predictions
    future_dates = forecast[['ds', 'yhat']].tail(28)
    
    return {
        'next_7': future_dates.head(7)['yhat'].sum(),
        'next_14': future_dates.head(14)['yhat'].sum(),
        'next_28': future_dates['yhat'].sum()
    }, r2