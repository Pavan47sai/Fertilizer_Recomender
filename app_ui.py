import streamlit as st
import pandas as pd
from app import recommend_fertilizer, le_soil, le_crop, X

st.set_page_config(page_title="Fertilizer Recommender", layout="centered")

# Custom CSS for better styling
st.markdown("""
<style>
    .main-header {
        background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
        padding: 2rem;
        border-radius: 10px;
        color: white;
        text-align: center;
        margin-bottom: 2rem;
    }
    .result-box {
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        padding: 2rem;
        border-radius: 15px;
        color: white;
        margin: 1rem 0;
    }
    .info-box {
        background: #f8f9fa;
        padding: 1.5rem;
        border-radius: 10px;
        border-left: 5px solid #667eea;
        margin: 1rem 0;
    }
    .summary-box {
        background: white;
        padding: 1.5rem;
        border-radius: 10px;
        border: 2px solid #e5e7eb;
        margin: 1rem 0;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .summary-item {
        padding: 0.5rem 0;
        border-bottom: 1px solid #f0f0f0;
    }
    .summary-item:last-child {
        border-bottom: none;
    }
</style>
""", unsafe_allow_html=True)

# Header
st.markdown('<div class="main-header"><h1>🌾 Smart Fertilizer Recommendation System</h1><p>Get personalized fertilizer suggestions based on soil and crop conditions using AI</p></div>', unsafe_allow_html=True)

# Sidebar for inputs
with st.sidebar:
    st.header("📊 Input Parameters")
    st.markdown("Enter your soil and crop details:")
    
    # Input fields
    temp = st.number_input("🌡️ Temperature (°C)", min_value=0.0, max_value=50.0, value=25.0, step=0.1, help="Soil temperature in Celsius")
    humidity = st.number_input("💧 Humidity (%)", min_value=0.0, max_value=100.0, value=60.0, step=0.1, help="Air humidity percentage")
    moisture = st.number_input("🌱 Moisture (%)", min_value=0.0, max_value=100.0, value=40.0, step=0.1, help="Soil moisture percentage")
    
    soil = st.selectbox("🧱 Soil Type", le_soil.classes_, help="Select your soil type")
    crop = st.selectbox("🌿 Crop Type", le_crop.classes_, help="Select the crop you want to grow")
    
    st.header("🔬 Soil Nutrient Levels")
    N = st.number_input("Nitrogen (N)", min_value=0, max_value=50, value=20, help="Current nitrogen level in soil")
    P = st.number_input("Phosphorus (P)", min_value=0, max_value=50, value=15, help="Current phosphorus level in soil")
    K = st.number_input("Potassium (K)", min_value=0, max_value=50, value=10, help="Current potassium level in soil")

# Main content area
col1, col2 = st.columns([2, 1])

with col1:
    st.header("🎯 Get Your Recommendation")
    
    # Recommendation button
    if st.button("🔍 Get Fertilizer Recommendation", type="primary", use_container_width=True):
        try:
            # Get recommendation
            fertilizer_code, fertilizer_name, description = recommend_fertilizer(temp, humidity, moisture, soil, crop, N, P, K)
            
            # Display result
            st.markdown(f"""
            <div class="result-box">
                <h2>🎯 Recommended Fertilizer</h2>
                <h1>{fertilizer_code}</h1>
                <p><strong>{fertilizer_name}</strong></p>
                <p>{description}</p>
            </div>
            """, unsafe_allow_html=True)
            
            # Input summary in white container
            st.markdown("""
            <div class="summary-box">
                <h4 style="color: #374151; margin-bottom: 1rem;">📋 Input Summary</h4>
            </div>
            """, unsafe_allow_html=True)
            
            # Create a proper summary display
            summary_data = {
                "Environmental Conditions": {
                    "🌡️ Temperature": f"{temp}°C",
                    "💧 Humidity": f"{humidity}%",
                    "🌱 Moisture": f"{moisture}%"
                },
                "Soil & Crop": {
                    "🧱 Soil Type": soil,
                    "🌿 Crop Type": crop
                },
                "Nutrient Levels (N-P-K)": {
                    "🔵 Nitrogen (N)": f"{N}",
                    "🟡 Phosphorus (P)": f"{P}",
                    "🟢 Potassium (K)": f"{K}"
                }
            }
            
            # Display summary in organized sections
            for section_title, items in summary_data.items():
                st.subheader(f"📊 {section_title}")
                cols = st.columns(len(items))
                for i, (key, value) in enumerate(items.items()):
                    with cols[i]:
                        st.metric(key, value)
                st.divider()

            # Additional fertilizer information
            st.markdown("""
            <div class="info-box">
                <h4>💡 About Your Recommendation</h4>
                <p>The AI model analyzed your soil conditions and crop type to recommend the optimal fertilizer. 
                This recommendation considers temperature, humidity, moisture, soil type, crop type, and current nutrient levels.</p>
            </div>
            """, unsafe_allow_html=True)
                
        except Exception as e:
            st.error(f"❌ Error getting recommendation: {str(e)}")
            st.info("💡 Make sure all input fields are filled correctly.")

with col2:
    st.header("ℹ️ Information")
    
    st.markdown("""
    <div class="info-box">
        <h4>🌡️ Temperature</h4>
        <p>Optimal range: 20-35°C</p>
        <p>Affects nutrient availability and microbial activity</p>
    </div>
    """, unsafe_allow_html=True)
    
    st.markdown("""
    <div class="info-box">
        <h4>💧 Humidity & Moisture</h4>
        <p>Humidity: Air moisture content</p>
        <p>Moisture: Soil water content</p>
        <p>Both affect nutrient uptake efficiency</p>
    </div>
    """, unsafe_allow_html=True)
    
    st.markdown("""
    <div class="info-box">
        <h4>🔬 N-P-K Values</h4>
        <p><strong>N (Nitrogen):</strong> Leaf growth</p>
        <p><strong>P (Phosphorus):</strong> Root development</p>
        <p><strong>K (Potassium):</strong> Flowering & fruiting</p>
    </div>
    """, unsafe_allow_html=True)

# Footer
st.markdown("---")
st.markdown("""
<div style='text-align: center; color: #666; padding: 1rem;'>
    <p>🌱 Powered by Machine Learning • Built with Streamlit</p>
    <p>Get the best fertilizer recommendations for optimal crop growth!</p>
</div>
""", unsafe_allow_html=True)
    
