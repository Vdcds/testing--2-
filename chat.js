(function () {
  class ChatWidget {
    constructor(config) {
      this.config = {
        color: "#00000",
        title: "Support",
        welcomeMessage: "How can we help you?",
        buttonAlign: "right",
        buttonText: "Chat",
        width: "340px",
        height: "540px",
        darkMode: false,
        customIcon: "null",
        displayStyle: "corner",
        starter_questions: [
          "Common questions",
          "Account help",
          "Troubleshooting",
        ],
        ...config,
      };
      this.isOpen = false;
      this.init();
    }

    createStyles() {
      const styles = `
        .docsbot-widget * {
          box-sizing: border-box;
          margin: 0;
          font: -apple-system-body / 1.4 -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        .docsbot-button {
          position: fixed;
          ${this.config.buttonAlign}: 24px;
          bottom: 24px;
          padding: 14px 24px;
          border: none;
          border-radius: 24px;
          background: ${this.config.color};
          color: #fff;
          cursor: pointer;
          display: flex;
          gap: 10px;
          align-items: center;
          box-shadow: 0 4px 16px rgba(0,0,0,0.1);
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          z-index: 1000;
          font-weight: 500;
          letter-spacing: -0.01em;
        }

        .docsbot-button:hover {
          transform: scale(1.04);
          box-shadow: 0 6px 20px rgba(0,0,0,0.15);
        }

        .docsbot-chat {
          position: fixed;
          ${
            this.config.displayStyle === "corner"
              ? `
            ${this.config.buttonAlign}: 24px;
            bottom: 88px;
          `
              : `
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          `
          }
          width: ${this.config.width};
          height: ${this.config.height};
          background: ${this.config.darkMode ? "#1C1C1E" : "#F5F5F7"};
          border-radius: 22px;
          box-shadow: 0 12px 48px rgba(0,0,0,0.2);
          display: none;
          flex-direction: column;
          z-index: 1000;
          overflow: hidden;
          border: 0.5px solid ${
            this.config.darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"
          };
        }

        .docsbot-header {
          padding: 20px 24px;
          background: ${
            this.config.darkMode
              ? "linear-gradient(180deg, #2C2C2E 0%, #1C1C1E 100%)"
              : "linear-gradient(180deg, #FFF 0%, #F5F5F7 100%)"
          };
          color: ${this.config.darkMode ? "#FFF" : "#000"};
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 0.5px solid ${
            this.config.darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"
          };
          backdrop-filter: blur(20px);
        }

        .docsbot-close {
          background: none;
          border: none;
          color: ${
            this.config.darkMode ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.5)"
          };
          cursor: pointer;
          padding: 6px;
          border-radius: 50%;
          transition: all 0.2s ease;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .docsbot-close:hover {
          background: ${
            this.config.darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"
          };
          color: ${this.config.darkMode ? "#FFF" : "#000"};
        }

        .docsbot-messages {
          flex: 1;
          padding: 24px;
          overflow-y: auto;
          background: transparent;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .docsbot-message {
          max-width: 80%;
          padding: 14px 18px;
          border-radius: 20px;
          line-height: 1.4;
          font-size: 15px;
          animation: messageSlide 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          position: relative;
          transition: transform 0.2s ease;
        }

        .docsbot-message.user {
          background: ${this.config.color};
          color: white;
          margin-left: auto;
          border-radius: 20px 6px 20px 20px;
        }

        .docsbot-message.assistant {
          background: ${
            this.config.darkMode
              ? "linear-gradient(180deg, #2C2C2E 0%, #363638 100%)"
              : "linear-gradient(180deg, #FFF 0%, #FBFBFD 100%)"
          };
          color: ${this.config.darkMode ? "#E5E5EA" : "#1D1D1F"};
          border-radius: 6px 20px 20px 20px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.03),
                      0 1px 2px rgba(0,0,0,0.03);
        }

        .docsbot-input-container {
          padding: 16px 24px;
          background: ${this.config.darkMode ? "#1C1C1E" : "#FFF"};
          border-top: 0.5px solid ${
            this.config.darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"
          };
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .docsbot-input {
          flex: 1;
          padding: 12px 18px;
          border: 1px solid ${
            this.config.darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"
          };
          border-radius: 18px;
          background: ${this.config.darkMode ? "#2C2C2E" : "#FFF"};
          color: ${this.config.darkMode ? "#E5E5EA" : "#1D1D1F"};
          font-size: 15px;
          transition: all 0.2s ease;
        }

        .docsbot-input:focus {
          outline: none;
          border-color: ${this.config.color}80;
          box-shadow: 0 0 0 4px ${this.config.color}20;
        }

        .docsbot-send {
          background: none;
          border: none;
          padding: 8px;
          cursor: pointer;
          color: ${this.config.color};
          transition: transform 0.2s ease;
        }

        .docsbot-send svg {
          width: 24px;
          height: 24px;
        }

        .docsbot-send:hover {
          transform: translateX(2px);
        }

        .starter-questions {
          margin-top: auto;
          padding: 16px;
          display: grid;
          gap: 12px;
          background: ${
            this.config.darkMode
              ? "linear-gradient(0deg, rgba(28,28,30,0.8) 0%, transparent 100%)"
              : "linear-gradient(0deg, rgba(255,255,255,0.8) 0%, transparent 100%)"
          };
          backdrop-filter: blur(20px);
        }

        .starter-question {
          color: ${this.config.color};
          cursor: pointer;
          padding: 12px 16px;
          border-radius: 14px;
          background: ${
            this.config.darkMode
              ? "rgba(255,255,255,0.05)"
              : "rgba(0,122,255,0.08)"
          };
          border: 0.5px solid ${
            this.config.darkMode
              ? "rgba(255,255,255,0.1)"
              : "rgba(0,122,255,0.1)"
          };
          transition: all 0.2s ease;
          font-weight: 500;
          font-size: 14px;
        }

        .starter-question:hover {
          background: ${
            this.config.darkMode
              ? "rgba(255,255,255,0.08)"
              : "rgba(0,122,255,0.12)"
          };
          transform: scale(1.02);
        }

        @keyframes messageSlide {
          from {
            opacity: 0;
            transform: translateY(12px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @media (max-width: 768px) {
          .docsbot-chat {
            width: 92%;
            height: 70vh;
            bottom: 24px;
            left: 50%;
            transform: translateX(-50%);
          }
        }
      `;

      const style = document.createElement("style");
      style.textContent = styles;
      document.head.appendChild(style);
    }

    init() {
      this.createStyles();
      this.createButton();
      this.createChat();
    }

    createButton() {
      this.button = document.createElement("button");
      this.button.className = "docsbot-button";
      this.button.innerHTML = `
        ${
          this.config.customIcon
            ? `
          <img src="${this.config.customIcon}" alt="Chat" width="20" height="20" />
        `
            : `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
          </svg>
        `
        }
        <span>${this.config.buttonText}</span>
      `;
      this.button.onclick = () => this.toggle();
      document.body.appendChild(this.button);
    }

    createChat() {
      this.chat = document.createElement("div");
      this.chat.className = "docsbot-chat";

      this.chat.innerHTML = `
        <div class="docsbot-header">
          <span>${this.config.title}</span>
          <button class="docsbot-close">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="docsbot-messages">
          <div class="docsbot-message assistant">${
            this.config.welcomeMessage
          }</div>
          <div class="starter-questions">
            ${this.config.starter_questions
              .map(
                (q) => `
              <div class="starter-question">${q}</div>
            `
              )
              .join("")}
          </div>
        </div>
        <div class="docsbot-input-container">
          <input type="text" class="docsbot-input" placeholder="Message..." />
          <button class="docsbot-send">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </button>
        </div>
      `;

      // Event handlers
      this.chat.querySelector(".docsbot-close").onclick = () => this.toggle();
      this.chat.querySelector(".docsbot-send").onclick = () =>
        this.sendMessage();
      this.chat.querySelector(".docsbot-input").onkeypress = (e) => {
        if (e.key === "Enter") this.sendMessage();
      };

      this.config.starter_questions.forEach((q, i) => {
        this.chat.querySelectorAll(".starter-question")[i].onclick = () => {
          this.chat.querySelector(".docsbot-input").value = q;
        };
      });

      document.body.appendChild(this.chat);
    }

    toggle() {
      this.isOpen = !this.isOpen;
      this.chat.style.display = this.isOpen ? "flex" : "none";
      if (this.config.displayStyle === "overlay") {
        document.body.style.overflow = this.isOpen ? "hidden" : "";
      }
    }

    async sendMessage() {
      const input = this.chat.querySelector(".docsbot-input");
      const message = input.value.trim();
      if (!message) return;

      input.value = "";
      this.addMessage("user", message);

      try {
        const response = await fetch(`${this.config.apiUrl}/response`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: message,
            chatbotId: this.config.botId,
            prompt: "be a helpful assistant",
          }),
        });

        const data = await response.json();
        this.addMessage("assistant", data.answer);
      } catch (error) {
        this.addMessage("assistant", "Connection error. Please try again.");
      }
    }

    addMessage(role, content) {
      const msg = document.createElement("div");
      msg.className = `docsbot-message ${role}`;
      msg.innerHTML = marked.parse(content);
      const messagesContainer = this.chat.querySelector(".docsbot-messages");
      messagesContainer.insertBefore(
        msg,
        messagesContainer.querySelector(".starter-questions")
      );
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }

  window.DocsBotAI = { init: (config) => new ChatWidget(config) };
})();
