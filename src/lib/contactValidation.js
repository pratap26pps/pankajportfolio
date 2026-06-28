export function validateName(name) {
  const trimmed = (name || "").trim();
  if (!trimmed) return "Name is required";
  if (trimmed.length < 2) return "Name must be at least 2 characters";
  if (trimmed.length > 80) return "Name must be under 80 characters";
  if (!/^[a-zA-Z\s.'-]+$/.test(trimmed)) {
    return "Name can only contain letters, spaces, and . ' -";
  }
  return null;
}

export function validateContactNumber(phone) {
  const trimmed = (phone || "").trim();
  if (!trimmed) return "Contact number is required";
  if (!/^[\d\s+\-().]+$/.test(trimmed)) return "Enter a valid contact number";
  const digits = trimmed.replace(/\D/g, "");
  if (digits.length < 10) return "Contact number must be at least 10 digits";
  if (digits.length > 15) return "Contact number is too long";
  return null;
}

export function validateEmail(email) {
  const trimmed = (email || "").trim();
  if (!trimmed) return "Email is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return "Enter a valid email address";
  }
  return null;
}

export function validateMessage(message) {
  const trimmed = (message || "").trim();
  if (!trimmed) return "Message is required";
  if (trimmed.length < 10) return "Message must be at least 10 characters";
  if (trimmed.length > 2000) return "Message must be under 2000 characters";
  return null;
}

export function validateContactForm({ name, contactNumber, email, message }) {
  const errors = {};
  const nameError = validateName(name);
  const phoneError = validateContactNumber(contactNumber);
  const emailError = validateEmail(email);
  const messageError = validateMessage(message);

  if (nameError) errors.name = nameError;
  if (phoneError) errors.contactNumber = phoneError;
  if (emailError) errors.email = emailError;
  if (messageError) errors.message = messageError;

  return errors;
}
