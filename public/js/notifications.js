async function respondToInvite(projectId, response) {
  const confirmed = confirm(`Do you want to ${response} the invitation for this project?`);
  if (!confirmed) return;

  const res = await fetch(`/projects/${projectId}/invite/respond`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ response })
  });

  const data = await res.json();
  if (res.ok) {
    alert(`Invitation ${response}!`);
    // Optionally refresh invite list
  } else {
    alert(data.message || "Error responding to invitation");
  }
}
