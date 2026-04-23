def calcular_estatisticas(numeros):
    """
    Calcula estatísticas básicas de uma lista de números.
    
    Args:
        numeros: Lista de números
        
    Returns:
        Tupla com: (soma, média, maior valor, menor valor)
    """
    if not numeros:
        return None
    
    soma = sum(numeros)
    media = soma / len(numeros)
    maior = max(numeros)
    menor = min(numeros)
    
    return soma, media, maior, menor


numeros = [23, 7, 45, 2, 67, 12, 89, 34, 56, 11]
soma, media, maior, menor = calcular_estatisticas(numeros)

print("Total:", soma)
print("Média:", media)
print("Maior:", maior)
print("Menor:", menor)