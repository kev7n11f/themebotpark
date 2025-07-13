export default function ContactUs() {
  return (
    <section className="static-page">
      <h1>📬 Contact Us</h1>
      <form>
        <input type="email" placeholder="Your email" />
        <textarea placeholder="Your message" />
        <button type="submit">Send</button>
      </form>
    </section>
  );
}