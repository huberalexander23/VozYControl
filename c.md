flowchart TD
    Inicio(["Arranca el conejo en el punto A (Faltan 100 cm para el final)"])
    
    Salto["El conejo da un salto: avanza la mitad de lo que le falta para llegar a B"]
    
    Suma["Revisamos cuánto camino lleva recorrido en total"]
    
    Revisar{"¿Ya pisó la marca de los 87,5 cm? \n(Ese es el punto C)"}
    
    Falta["Todavía no llega. Le toca prepararse para el siguiente salto."]
    
    Fin(["¡Bingo! Cayó exactamente en la marca. \nSe acabó el recorrido hacia C."])

    Inicio --> Salto
    Salto --> Suma
    Suma --> Revisar
    Revisar -- "No, todavía le falta" --> Falta
    Falta --> Salto
    Revisar -- "Sí, justo ahí" --> Fin
