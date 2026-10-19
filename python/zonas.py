"""Cálculo de zona de pulso (misma lógica que site/js/app.js). Uso: python python/zonas.py 45 --reposo 70"""
import argparse, math

def _r(x):  # redondeo "hacia arriba en .5", igual que JavaScript
    return math.floor(x + 0.5)

def fc_max(edad):
    """Pulso máximo estimado, fórmula de Tanaka (2001)."""
    return _r(208 - 0.7 * edad)

def zona(edad, reposo=None):
    """Devuelve (bajo, alto, método). Con pulso en reposo usa Karvonen 40-60 %; si no, 60-70 % del máximo."""
    m = fc_max(edad)
    if reposo and 35 <= reposo <= 120 and reposo < m:
        k = m - reposo
        return _r(reposo + k * 0.4), _r(reposo + k * 0.6), "karvonen"
    return _r(m * 0.6), _r(m * 0.7), "porcentaje"

if __name__ == "__main__":
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("edad", type=int)
    p.add_argument("--reposo", type=int)
    a = p.parse_args()
    lo, hi, met = zona(a.edad, a.reposo)
    print(f"Pulso máximo: {fc_max(a.edad)} | Zona: {lo}-{hi} lat/min ({met})")
