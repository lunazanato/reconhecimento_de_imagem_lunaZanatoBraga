# Explicação do arquivo num_primos.py

Este documento apresenta uma explicação linha por linha do código presente em `num_primos.py`, um módulo Python para verificação e listagem de números primos.

```python
"""Módulo para verificação de números primos."""
```
- Declaração de docstring do módulo. Explica o propósito geral do arquivo: verificar números primos.

```python
from math import isqrt
from typing import Iterator
```
- Importa `isqrt` da biblioteca padrão `math`. Essa função calcula a raiz quadrada inteira de um número.
- Importa `Iterator` de `typing` para anotar o tipo de retorno de um gerador.

```python
def _gerar_divisores_impares(limite: int) -> Iterator[int]:
    """Gera divisores ímpares de 3 até o limite."""
    divisor = 3
    while divisor <= limite:
        yield divisor
        divisor += 2
```
- Define a função `_gerar_divisores_impares` que recebe um `limite` inteiro.
- O nome começa com `_`, indicando uso interno do módulo.
- Começa a partir de `3` porque todos os números pares já são tratados separadamente.
- O `while` percorre todos os divisores ímpares até `limite`.
- `yield` retorna cada divisor de forma paulatina, criando um gerador.
- `divisor += 2` avança para o próximo número ímpar.

```python
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
```
- Define a função `eh_primo` que recebe um inteiro `n` e retorna um booleano.
- A docstring descreve os argumentos, retorno e exceções possíveis.

```python
    if n < 0:
        raise ValueError("Número negativo não pode ser primo")
```
- Se `n` for negativo, a função levanta um `ValueError` com mensagem explicativa.
- Números negativos não são considerados primos.

```python
    if n < 2:
        return False
```
- Retorna `False` para 0 e 1, que não são primos.

```python
    if n == 2:
        return True
```
- Retorna `True` para 2, que é o único número primo par.

```python
    if n % 2 == 0:
        return False
```
- Elimina números pares maiores que 2 como não primos, pois são divisíveis por 2.

```python
    raiz = isqrt(n)
```
- Calcula a raiz quadrada inteira de `n`.
- Testar divisores acima dessa raiz é redundante, pois todo divisor maior que a raiz teria um par menor.

```python
    for divisor in _gerar_divisores_impares(raiz):
        if n % divisor == 0:
            return False
```
- Usa o gerador de divisores ímpares para verificar possíveis divisores de `n`.
- Se `n` for divisível por qualquer divisor ímpar em `3..raiz`, retorna `False`.

```python
    return True
```
- Se nenhum divisor válido for encontrado, `n` é primo.

```python
def listar_primos(limite: int) -> list[int]:
    """
    Lista todos os números primos até um limite.
    
    Args:
        limite: Número máximo a verificar.
    
    Returns:
        Lista de números primos.
    """
```
- Define a função `listar_primos` que retorna todos os primos até `limite` inclusive.
- A docstring explica o propósito e o tipo do retorno.

```python
    return [n for n in range(2, limite + 1) if eh_primo(n)]
```
- Retorna uma lista por compreensão (list comprehension).
- Percorre todos os números de `2` até `limite`.
- Inclui `n` na lista apenas se `eh_primo(n)` for `True`.

```python
# Testes
if __name__ == "__main__":
```
- A condicional verifica se o arquivo está sendo executado como script principal.
- Código dentro deste bloco não roda quando o módulo é importado por outro arquivo.

```python
    numeros_teste = [1, 2, 3, 4, 5, 17, 18, 19, 20, 97]
```
- Define uma lista de números para testar a função `eh_primo`.

```python
    print("=== Testes de verificação ===")
    for num in numeros_teste:
        resultado = "✓" if eh_primo(num) else "✗"
        print(f"{num:>3} é primo? {resultado}")
```
- Imprime um cabeçalho para os testes.
- Para cada número da lista, chama `eh_primo`.
- Exibe `✓` se o número for primo e `✗` caso contrário.
- O `f"{num:>3}"` formata o número com largura mínima de 3 caracteres.

```python
    print("\n=== Números primos até 50 ===")
    print(listar_primos(50))
```
- Imprime um segundo cabeçalho.
- Exibe a lista de todos os números primos até 50 usando `listar_primos`.
