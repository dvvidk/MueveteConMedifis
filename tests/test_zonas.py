import sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).parent.parent / "python"))
from zonas import fc_max, zona

def test_fc_max():
    assert fc_max(40) == 180
    assert fc_max(45) == 177  # 176,5 redondea hacia arriba

def test_zona_sin_reposo():
    assert zona(40) == (108, 126, "porcentaje")

def test_zona_karvonen():
    assert zona(40, 70) == (114, 136, "karvonen")

def test_reposo_invalido_cae_a_porcentaje():
    assert zona(40, 20)[2] == "porcentaje"
