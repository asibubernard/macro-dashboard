# 🇬🇭 Ghana Macroeconomic Dashboard

An interactive web dashboard visualising key macroeconomic indicators for Ghana, built using real Bank of Ghana data trends (2010–2024).

**Live Demo:** [https://macro-dashboard-ndm9.onrender.com/](#) &nbsp;|&nbsp; **Portfolio:** [linkedin.com/in/bernardasibu](https://linkedin.com/in/asibubernard)

---

## 📊 Features

- **4 live KPI cards** — Headline Inflation, GDP Growth, USD/GHS Rate, Policy Rate with year-on-year change indicators
- **6 interactive Plotly charts** — Inflation vs Policy Rate, GDP Growth (bar), FX Rate, Credit Growth, Banking Assets, NPL vs Capital Adequacy
- **SQLite backend** — all data stored and queried via SQL
- **REST API** — Flask endpoints serve JSON to the frontend (`/api/macro`, `/api/banking`, `/api/summary`)
- Fully responsive design (mobile + desktop)

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Python · Flask · SQLite |
| Data | Pandas · NumPy |
| Visualisation | Plotly.js |
| Deployment | Render / Railway |

## 📁 Project Structure

```
project1-macro-dashboard/
├── app.py                  # Flask application & API routes
├── requirements.txt
├── data/
│   ├── generate_data.py    # Seeds SQLite DB from structured data
│   └── macro.db            # SQLite database
├── templates/
│   └── index.html          # Dashboard HTML
└── static/
    ├── css/style.css
    └── js/dashboard.js     # Plotly chart rendering & API calls
```

## 🚀 Run Locally

```bash
git clone https://github.com/asibubernard/ghana-macro-dashboard
cd ghana-macro-dashboard
pip install -r requirements.txt
python data/generate_data.py   # seed the database
python app.py
# Open http://localhost:5000
```

## 🌐 Deploy to Render (Free)

1. Push to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect your repo
4. Build command: `pip install -r requirements.txt && python data/generate_data.py`
5. Start command: `gunicorn app:app`

## 📈 Data Sources

Data modelled on Bank of Ghana Statistical Bulletins, Monetary Policy Reports, and Annual Banking Sector Reports. All figures reflect documented public trends.

- [Bank of Ghana Statistical Database](https://www.bog.gov.gh/economic-data/)
- [BoG Monetary Policy Reports](https://www.bog.gov.gh/monetary-policy/)
- [World Bank Ghana Data](https://data.worldbank.org/country/ghana)

---

*Built as part of a Data Analytics portfolio targeting financial sector roles in Ghana.*
