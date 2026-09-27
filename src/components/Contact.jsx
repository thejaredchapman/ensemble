import { useState } from "react";

const CONTACT_EMAIL = "adonish16@gmail.com";

function buildMailto({ subject, name, email, phone, message }) {
  const body = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${phone || "—"}`,
    "",
    message,
  ].join("\n");

  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function ContactForm({ id, title, description, messageLabel, messagePlaceholder, subjectPrefix, submitLabel, note }) {
  const [values, setValues] = useState({ name: "", email: "", phone: "", message: "" });

  const update = (field) => (e) => setValues((v) => ({ ...v, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    window.location.href = buildMailto({
      subject: `${subjectPrefix} from ${values.name}`,
      ...values,
    });
  };

  return (
    <form className="contact-form glass" onSubmit={handleSubmit} aria-labelledby={`${id}-title`}>
      <h2 className="contact-form__title" id={`${id}-title`}>{title}</h2>
      <p className="contact-form__description">{description}</p>
      {note && <p className="contact-form__note">{note}</p>}

      <label className="contact-form__field">
        <span className="contact-form__label">Name</span>
        <input
          className="contact-form__input"
          type="text"
          required
          value={values.name}
          onChange={update("name")}
          autoComplete="name"
        />
      </label>

      <label className="contact-form__field">
        <span className="contact-form__label">Email</span>
        <input
          className="contact-form__input"
          type="email"
          required
          value={values.email}
          onChange={update("email")}
          autoComplete="email"
        />
      </label>

      <label className="contact-form__field">
        <span className="contact-form__label">Phone number</span>
        <input
          className="contact-form__input"
          type="tel"
          value={values.phone}
          onChange={update("phone")}
          autoComplete="tel"
        />
      </label>

      <label className="contact-form__field">
        <span className="contact-form__label">{messageLabel}</span>
        <textarea
          className="contact-form__input contact-form__textarea"
          required
          rows={5}
          placeholder={messagePlaceholder}
          value={values.message}
          onChange={update("message")}
        />
      </label>

      <button className="contact-form__submit" type="submit">
        {submitLabel}
      </button>
    </form>
  );
}

export function Contact({ onBack }) {
  return (
    <div className="contact-page">
      <div className="contact-page__header glass">
        <div>
          <h1 className="contact-page__title">Get in touch</h1>
          <p className="contact-page__subtitle">
            Suggest a new exercise for the library, or ask about bringing a
            workshop to your group.
          </p>
        </div>
        <button className="contact-page__back" onClick={onBack}>
          ← Back to library
        </button>
      </div>

      <div className="contact-grid">
        <ContactForm
          id="add-exercise"
          title="✨ Add an exercise"
          description="Know a great warm-up, game, or exercise that's missing from the library? Send it our way."
          messageLabel="Tell us about the exercise"
          messagePlaceholder="Name of the exercise, how it's played, group size, energy level, why you love it…"
          subjectPrefix="Exercise submission"
          submitLabel="Send exercise idea"
        />

        <ContactForm
          id="request-workshop"
          title="🎭 Request a workshop"
          description="Bring an improv workshop to your team, classroom, or theatre."
          note="Note: workshops are currently only available in the Chicago area."
          messageLabel="Tell us about your group"
          messagePlaceholder="Group size, experience level, goals for the workshop, preferred dates…"
          subjectPrefix="Workshop request"
          submitLabel="Send workshop request"
        />
      </div>
    </div>
  );
}
