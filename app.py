from flask import Flask, render_template, jsonify
import sqlite3, json, os
import pandas as pd

app = Flask(__name__)
DB = os.path.join(os.path.dirname(__file__), 'data', 'macro.db')

def query(sql):
    conn = sqlite3.connect(DB)
    df = pd.read_sql_query(sql, conn)
    conn.close()
    return df

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/macro')
def macro():
    df = query("SELECT * FROM macro_indicators ORDER BY period")
    return jsonify(df.to_dict(orient='list'))

@app.route('/api/banking')
def banking():
    df = query("SELECT * FROM banking_sector ORDER BY year")
    return jsonify(df.to_dict(orient='list'))

@app.route('/api/summary')
def summary():
    df = query("SELECT * FROM macro_indicators ORDER BY period")
    latest = df.iloc[-1]
    prev   = df.iloc[-5]
    return jsonify({
        'inflation':     round(float(latest['inflation_rate']), 1),
        'inflation_chg': round(float(latest['inflation_rate'] - prev['inflation_rate']), 1),
        'gdp':           round(float(latest['gdp_growth']), 1),
        'gdp_chg':       round(float(latest['gdp_growth'] - prev['gdp_growth']), 1),
        'fx':            round(float(latest['usd_exchange_rate']), 2),
        'fx_chg':        round(float(latest['usd_exchange_rate'] - prev['usd_exchange_rate']), 2),
        'policy':        round(float(latest['policy_rate']), 1),
        'policy_chg':    round(float(latest['policy_rate'] - prev['policy_rate']), 1),
    })

if __name__ == '__main__':
    app.run(debug=True)
