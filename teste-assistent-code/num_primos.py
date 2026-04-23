"""Módulo para verificação de números primos."""

from math import isqrt
from typing import Iterator


def _gerar_divisores_impares(limite: int) -> Iterator[int]:
    """Gera divisores ímpares de 3 até o limite."""
    divisor = 3
    while divisor <= limite:
        yield divisor
        divisor += 2


def eh_primo(n: int) -> bool:
    """
    Verifica se um número é primo.
    
    Args:
        n: Número inteiro a ser verificado.
    
    Returns:
        True se o número for primo, False caso contrário.
    
    Raises:
        ValueError: Se n for negativo.
    """
    if n < 0:
        raise ValueError("Número negativo não pode ser primo")
    
    if n < 2:
        return False
    
    if n == 2:
        return True
    
    if n % 2 == 0:
        return False
    
    raiz = isqrt(n)
    
    for divisor in _gerar_divisores_impares(raiz):
        if n % divisor == 0:
            return False
    
    return True


def listar_primos(limite: int) -> list[int]:
    """
    Lista todos os números primos até um limite.
    
    Args:
        limite: Número máximo a verificar.
    
    Returns:
        Lista de números primos.
    """
    return [n for n in range(2, limite + 1) if eh_primo(n)]


# Testes
if __name__ == "__main__":
    numeros_teste = [1, 2, 3, 4, 5, 17, 18, 19, 20, 97]
    
    print("=== Testes de verificação ===")
    for num in numeros_teste:
        resultado = "✓" if eh_primo(num) else "✗"
        print(f"{num:>3} é primo? {resultado}")
    
    print("\n=== Números primos até 50 ===")
    print(listar_primos(50))