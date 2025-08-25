const evaluationStatutUpdate = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/evaluation/feuille/statut", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status} ${response.statusText}`);
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      return data;
    } else {
      throw new Error("Le serveur n'a pas renvoyé un JSON valide.");
    }
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Erreur lors de l'appel API:`, error);
    throw error;
  }
};

evaluationStatutUpdate();