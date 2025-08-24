from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
import pandas as pd

# Load dataset
df = pd.read_csv('dataset/Fertilizer Prediction.csv')

# # Show first few rows
# print(df.head())

# # Show data summary
# print(df.info())

# # Check unique values
# print(df['Soil Type'].unique())
# print(df['Crop Type'].unique())

# Create LabelEncoder instances
le_soil = LabelEncoder()
le_crop = LabelEncoder()
le_fert = LabelEncoder()

# Apply Label Encoding to categorical columns
df['Soil Type'] = le_soil.fit_transform(df['Soil Type'])
df['Crop Type'] = le_crop.fit_transform(df['Crop Type'])
df['Fertilizer Name'] = le_fert.fit_transform(df['Fertilizer Name'])

# Features and target variable
X = df.drop('Fertilizer Name', axis=1)  # Input features
y = df['Fertilizer Name']               # Target label

# Split into training and test data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# print("✅ Preprocessing complete.")
# print("Training samples:", len(X_train))
# print("Testing samples:", len(X_test))

from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report

# Create the model
model = RandomForestClassifier()

# Train the model
model.fit(X_train, y_train)

# Predict on test set
y_pred = model.predict(X_test)

# Evaluate the model
accuracy = accuracy_score(y_test, y_pred)
# print(f"\n✅ Model trained successfully!")
# print(f"🔍 Accuracy on test data: {accuracy:.2f}")
# print("\n📋 Classification Report:")
# print(classification_report(y_test, y_pred))

fertilizer_info = {
    "10-26-26": {
        "name": "Diammonium Phosphate (DAP)",
        "desc": "Provides nitrogen and phosphorus essential for plant growth, especially in the early stages."
    },
    "14-35-14": {
        "name": "GROMOR",
        "desc": "A balanced fertilizer for crops needing moderate nitrogen and higher phosphorus and potassium."
    },
    "17-17-17": {
        "name": "NPK 17-17-17 (SOP)",
        "desc": "A balanced fertilizer that supplies equal parts nitrogen, phosphorus, and potassium."
    },
    "20-20": {
        "name": "Ammonium Sulfate",
        "desc": "Helps improve soil nitrogen and sulfur levels for leafy crops."
    },
    "28-28": {
        "name": "Urea + Phosphate",
        "desc": "Good for overall plant development and flowering in neutral soils."
    },
    "0-52-34": {
        "name": "Mono Potassium Phosphate",
        "desc": "Used to increase flowering and fruiting with high phosphorus and potassium."
    },
    "Urea": {
        "name": "Urea",
        "desc": "Highly concentrated nitrogen fertilizer that boosts leaf and stem growth."
    },
    "DAP": {
        "name": "DAP (Diammonium Phosphate)",
        "desc": "Quick nitrogen supply and enhances root strength."
    }
}


def recommend_fertilizer(temp, humidity, moisture, soil, crop, N, P, K):
    # Encode soil and crop types
    soil_encoded = le_soil.transform([soil])[0]
    crop_encoded = le_crop.transform([crop])[0]

    # Prepare input data
    input_data = pd.DataFrame([[
        temp, humidity, moisture, soil_encoded, crop_encoded, N, P, K
    ]], columns=X.columns)

    # Predict class
    predicted_class = model.predict(input_data)[0]

    # Decode predicted label to fertilizer code
    fertilizer_code = le_fert.inverse_transform([predicted_class])[0]

    # Get fertilizer details
    fert_details = fertilizer_info.get(fertilizer_code, {
        "name": "Unknown Fertilizer",
        "desc": "No details available for this fertilizer."
    })

    return fertilizer_code, fert_details['name'], fert_details['desc']


# 🔍 Test with sample input
# sample_fertilizer = recommend_fertilizer(
#     temp=30, 
#     humidity=60, 
#     moisture=25, 
#     soil='Loamy', 
#     crop='Sugarcane', 
#     N=20, 
#     P=30, 
#     K=10
# )
# print("\n🧪 Recommended Fertilizer:", sample_fertilizer)
