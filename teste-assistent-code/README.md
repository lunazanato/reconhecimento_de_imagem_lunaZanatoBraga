# Verificador de Números Primos

Módulo Python para verificação e listagem de números primos, seguindo princípios de **Clean Code**.

## O que é um número primo?

Um número primo é um número natural maior que 1 que não possui divisores positivos além de 1 e ele mesmo.

## Instalação

```bash
# Clone o repositório ou copie o arquivo num_primos.py para seu projeto
```

## Como usar

```python
from num_primos import eh_primo, listar_primos

# Verificar se um número é primo
print(eh_primo(7))    # True
print(eh_primo(10))   # False
print(eh_primo(97))   # True

# Listar primos até um limite
print(listar_primos(50))  # [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47]
```

## API

### `eh_primo(n: int) -> bool`

Verifica se um número é primo.

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `n` | int | Número inteiro a ser verificado |

**Retorna:** `True` se o número for primo, `False` caso contrário.

**Levanta:** `ValueError` se o número for negativo.

### `listar_primos(limite: int) -> list[int]`

Lista todos os números primos até um limite.

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `limite` | int | Número máximo a verificar |

**Retorna:** Lista de números primos.

## Explicação do Código

### Estrutura do Módulo

```python
"""Módulo para verificação de números primos."""

from math import isqrt
from typing import Iterator
```

- **Docstring do módulo**: Descrição clara do propósito
- **Imports**: `isqrt` para raiz quadrada inteira (mais preciso), `Iterator` para type hints

### Função Auxiliar `_gerar_divisores_impares()`

```python
def _gerar_divisores_impares(limite: int) -> Iterator[int]:
    """Gera divisores ímpares de 3 até o limite."""
    divisor = 3
    while divisor <= limite:
        yield divisor
        divisor += 2
```

- **Nome com underscore**: Indica função privada (não para uso externo)
- **Generator**: Usa `yield` para memória eficiente
- **Type hints**: Especifica tipos de entrada e saída

### Função Principal `eh_primo()`

```python
def eh_primo(n: int) -> bool:
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
```

**Lógica:**
1. Valida entrada negativa com exceção clara
2. Números < 2 não são primos
3. 2 é o único primo par
4. Números pares > 2 não são primos
5. Verifica apenas divisores ímpares até a raiz quadrada

### Função `listar_primos()`

```python
def listar_primos(limite: int) -> list[int]:
    return [n for n in range(2, limite + 1) if eh_primo(n)]
```

- **List comprehension**: Forma concisa e Pythonica
- **Range**: Começa em 2 (menor primo possível)

## Otimizações

| Técnica | Benefício |
|---------|-----------|
| `isqrt()` | Raiz quadrada inteira, sem erros de ponto flutuante |
| Verificar apenas ímpares | Reduz verificações pela metade |
| Limite na raiz quadrada | Complexidade O(√n) em vez de O(n) |
| Generator | Memória eficiente para grandes intervalos |

## Executar Testes

```bash
python num_primos.py
```

**Saída:**
```
=== Testes de verificação ===
  1 é primo? ✗
  2 é primo? ✓
  3 é primo? ✓
  4 é primo? ✗
  5 é primo? ✓
 17 é primo? ✓
 18 é primo? ✗
 19 é primo? ✓
 20 é primo? ✗
 97 é primo? ✓

=== Números primos até 50 ===
[2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47]
```

## Clean Code Aplicado

- ✅ Nomes descritivos (`eh_primo`, `listar_primos`)
- ✅ Funções pequenas e com responsabilidade única
- ✅ Type hints para clareza
- ✅ Docstrings completas
- ✅ Tratamento de erros
- ✅ Funções privadas com underscore
- ✅ Código autoexplicativo
5 é primo? True
17 é primo? True
18 é primo? False
19 é primo? True
20 é primo? False
97 é primo? True
```