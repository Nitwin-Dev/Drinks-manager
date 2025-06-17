#!/usr/bin/env python3
import requests
import json

# Teste de login
try:
    response = requests.post('http://localhost:5001/api/login', 
                           json={'email': 'atendente@teste.com', 'password': '123456'},
                           timeout=5)
    print(f"Login Status: {response.status_code}")
    print(f"Login Response: {response.json()}")
    
    if response.status_code == 200:
        token = response.json()['access_token']
        
        # Teste de consulta de convidado
        headers = {'Authorization': f'Bearer {token}'}
        guest_response = requests.get('http://localhost:5001/api/guest/usr_a49fd8', 
                                    headers=headers, timeout=5)
        print(f"Guest Status: {guest_response.status_code}")
        print(f"Guest Response: {guest_response.json()}")
        
        # Teste de registro de drink
        drink_response = requests.post('http://localhost:5001/api/guest/usr_a49fd8/drink', 
                                     headers=headers, timeout=5)
        print(f"Drink Status: {drink_response.status_code}")
        print(f"Drink Response: {drink_response.json()}")
        
except Exception as e:
    print(f"Erro: {e}")

