const BASE_URL = "http://localhost:8080/api/issues";

async function handleResponse(response) {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }
  return response.json();
}

export async function fetchAllIssues() {
  const response = await fetch(`${BASE_URL}`);
  return handleResponse(response);
}

export async function fetchStats() {
  const response = await fetch(`${BASE_URL}/stats/summary`);
  return handleResponse(response);
}

export async function createIssue(issueData) {
  const response = await fetch(`${BASE_URL}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(issueData),
  });
  return handleResponse(response);
}

export async function updateIssue(id, issueData) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(issueData),
  });
  return handleResponse(response);
}

export async function updateIssueStatus(id, status) {
  const response = await fetch(`${BASE_URL}/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  return handleResponse(response);
}

export async function deleteIssue(id) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
  return handleResponse(response);
}