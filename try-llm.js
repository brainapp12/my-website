document.addEventListener("DOMContentLoaded", function() {
    const chatBox = document.getElementById("chat-box");
    const userInput = document.getElementById("user-input");
    const sendButton = document.getElementById("send-button");
    const apiKeyInput = document.getElementById("api-key-input");
    const setApiKeyButton = document.getElementById("set-api-key-button");
    const chatContainer = document.getElementById("chat-container");
    let apiKey = '';

    setApiKeyButton.addEventListener("click", function() {
        apiKey = apiKeyInput.value.trim();
        if (apiKey) {
            apiKeyInput.disabled = true;
            setApiKeyButton.disabled = true;
            chatContainer.style.display = "block";
        }
    });

    sendButton.addEventListener("click", function() {
        const userMessage = userInput.value;
        if (userMessage.trim() === "") return;

        appendMessage("ユーザー", userMessage);
        userInput.value = "";

        // LLMへのリクエストを送信
        fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini", // 使用するモデル名を確認してください
                messages: [{ role: "user", content: userMessage }],
                max_tokens: 100
            })
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(errorInfo => Promise.reject(errorInfo));
            }
            return response.json();
        })
        .then(data => {
            const llmMessage = data.choices[0].message.content.trim();
            appendMessage("LLM", llmMessage);
        })
        .catch(error => {
            console.error("Error:", error);
            appendMessage("LLM", `エラーが発生しました: ${error.error.message}`);
        });
    });

    function appendMessage(sender, message) {
        const messageElement = document.createElement("div");
        messageElement.className = "message";
        messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight;
    }
});
