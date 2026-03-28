const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const generateTopics = async (subject: string) => {
  try {
    const response = await fetch(`${API_BASE}/api/ai/generate-topics`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ subject }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate topics');
    }

    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error('Error generating topics:', error);
    throw error;
  }
};

export const generateAbstract = async (title: string, description: string) => {
  try {
    const response = await fetch(`${API_BASE}/api/ai/generate-abstract`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, description }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate abstract');
    }

    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error('Error generating abstract:', error);
    throw error;
  }
};

export const checkPlagiarism = async (text: string) => {
  try {
    const response = await fetch(`${API_BASE}/api/ai/check-plagiarism`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    const data = await response.json();
    
    // Even if the response has an error status, check if it contains a result
    if (data.result) {
      return data.result;
    }
    
    // If no result but there's an error message, throw with more details
    if (data.error) {
      throw new Error(data.error);
    }
    
    // If response is not ok and no result, throw with status
    if (!response.ok) {
      throw new Error(`Server error: ${response.status} ${response.statusText}`);
    }
    
    return data.result || 'Analysis completed but no result was returned.';
  } catch (error) {
    console.error('Error checking plagiarism:', error);
    
    // Re-throw with more context
    if (error instanceof Error) {
      throw new Error(`Plagiarism check failed: ${error.message}`);
    }
    throw new Error('Plagiarism check failed due to network error');
  }
};
