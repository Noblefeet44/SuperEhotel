'use client';

import { useState } from 'react';
import { Metadata } from 'next';
import { MapPin, Phone, Mail, Clock, MessageCircle, Send } from 'lucide-react';
import { generateWhatsAppURL, generatePhoneURL } from '@/lib/utils';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const whatsappNumber = '09131964939';
  const phoneNumber = '09131964939';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // For now, generate a WhatsApp message with the contact form data
    const message = `📩 CONTACT FORM — SUPER E LUXURY HOTEL

👤 Name: ${formData.name}
📧 Email: ${formData.email || 'Not provided'}
📱 Phone: ${formData.phone}

💬 Message:
${formData.message}`;

    // Open WhatsApp with the message
    window.open(generateWhatsAppURL(whatsappNumber, message), '_blank');
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <>
      {/* Page Header */}
      <section style={{
        background: 'linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 100%)',
        paddingTop: 'calc(80px + var(--space-3xl))',
        paddingBottom: 'var(--space-3xl)',
      }}>
        <div className="section-container" style={{ textAlign: 'center' }}>
          <p className="section-label" style={{ color: 'var(--color-accent-light)' }}>Get In Touch</p>
          <h1 style={{ color: '#FFFFFF', marginBottom: 'var(--space-md)' }}>Contact Us</h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.8)', maxWidth: '600px', margin: '0 auto', fontSize: '1.05rem' }}>
            We&apos;d love to hear from you. Reach out for reservations, inquiries, or feedback.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="section-padding" style={{ background: 'var(--color-background)' }}>
        <div className="section-container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: 'var(--space-2xl)',
            maxWidth: '1000px',
            margin: '0 auto',
          }}>
            {/* Contact Info Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: 'var(--space-lg)',
            }}>
              <div className="card-static" style={{ padding: 'var(--space-xl)', textAlign: 'center' }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  width: '52px', height: '52px', borderRadius: 'var(--radius-full)',
                  background: 'rgba(30, 58, 138, 0.08)', color: 'var(--color-primary)',
                  marginBottom: 'var(--space-md)',
                }}>
                  <MapPin size={24} />
                </div>
                <h4 style={{ marginBottom: 'var(--space-sm)' }}>Location</h4>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9375rem' }}>
                  Keffi, Nasarawa State, Nigeria
                </p>
              </div>

              <a href={generatePhoneURL(phoneNumber)} className="card-static" style={{ padding: 'var(--space-xl)', textAlign: 'center', textDecoration: 'none', color: 'inherit' }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  width: '52px', height: '52px', borderRadius: 'var(--radius-full)',
                  background: 'rgba(30, 58, 138, 0.08)', color: 'var(--color-primary)',
                  marginBottom: 'var(--space-md)',
                }}>
                  <Phone size={24} />
                </div>
                <h4 style={{ marginBottom: 'var(--space-sm)' }}>Phone</h4>
                <p style={{ color: 'var(--color-primary)', fontSize: '0.9375rem', fontWeight: 500 }}>
                  {phoneNumber}
                </p>
              </a>

              <a
                href={generateWhatsAppURL(whatsappNumber, 'Hello! I have a question about Super E Luxury Hotel.')}
                target="_blank"
                rel="noopener noreferrer"
                className="card-static"
                style={{ padding: 'var(--space-xl)', textAlign: 'center', textDecoration: 'none', color: 'inherit' }}
              >
                <div style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  width: '52px', height: '52px', borderRadius: 'var(--radius-full)',
                  background: 'rgba(37, 211, 102, 0.08)', color: 'var(--color-whatsapp-dark)',
                  marginBottom: 'var(--space-md)',
                }}>
                  <MessageCircle size={24} />
                </div>
                <h4 style={{ marginBottom: 'var(--space-sm)' }}>WhatsApp</h4>
                <p style={{ color: 'var(--color-whatsapp-dark)', fontSize: '0.9375rem', fontWeight: 500 }}>
                  Chat with us
                </p>
              </a>

              <div className="card-static" style={{ padding: 'var(--space-xl)', textAlign: 'center' }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  width: '52px', height: '52px', borderRadius: 'var(--radius-full)',
                  background: 'rgba(30, 58, 138, 0.08)', color: 'var(--color-primary)',
                  marginBottom: 'var(--space-md)',
                }}>
                  <Clock size={24} />
                </div>
                <h4 style={{ marginBottom: 'var(--space-sm)' }}>Hours</h4>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9375rem' }}>
                  24/7 — Always Open
                </p>
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: 'var(--space-2xl)',
            }}>
              {/* Contact Form */}
              <div className="card-static" style={{ padding: 'var(--space-xl)' }}>
                <h2 style={{ marginBottom: 'var(--space-xl)' }}>Send Us a Message</h2>

                {isSubmitted ? (
                  <div style={{ textAlign: 'center', padding: 'var(--space-2xl)' }}>
                    <div style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      width: '64px', height: '64px', borderRadius: 'var(--radius-full)',
                      background: 'rgba(22, 163, 74, 0.1)', color: 'var(--color-success)',
                      marginBottom: 'var(--space-lg)',
                    }}>
                      <Send size={28} />
                    </div>
                    <h3 style={{ marginBottom: 'var(--space-md)' }}>Message Sent!</h3>
                    <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-lg)' }}>
                      Your message has been sent via WhatsApp. We&apos;ll get back to you shortly.
                    </p>
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="btn btn-outline"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
                    <div>
                      <label htmlFor="contact-name" className="label">Full Name *</label>
                      <input
                        id="contact-name"
                        type="text"
                        className="input"
                        placeholder="Your full name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--space-lg)' }}>
                      <div>
                        <label htmlFor="contact-phone" className="label">Phone Number *</label>
                        <input
                          id="contact-phone"
                          type="tel"
                          className="input"
                          placeholder="Your phone number"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="contact-email" className="label">Email (Optional)</label>
                        <input
                          id="contact-email"
                          type="email"
                          className="input"
                          placeholder="Your email address"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="contact-message" className="label">Message *</label>
                      <textarea
                        id="contact-message"
                        className="input"
                        placeholder="How can we help you?"
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        required
                        style={{ resize: 'vertical', minHeight: '120px' }}
                      />
                    </div>
                    <button type="submit" className="btn btn-primary btn-lg" disabled={isSubmitting}>
                      <Send size={18} />
                      {isSubmitting ? 'Sending...' : 'Send via WhatsApp'}
                    </button>
                  </form>
                )}
              </div>

              {/* Map Placeholder */}
              <div className="card-static" style={{ overflow: 'hidden' }}>
                <div style={{
                  height: '350px',
                  background: 'var(--color-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-text-muted)',
                  flexDirection: 'column',
                  gap: 'var(--space-md)',
                }}>
                  <MapPin size={48} style={{ opacity: 0.5 }} />
                  <div style={{ textAlign: 'center' }}>
                    <h3 style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-sm)' }}>
                      Super E Luxury Hotel &amp; Suites
                    </h3>
                    <p>Keffi, Nasarawa State, Nigeria</p>
                    <p style={{ fontSize: '0.8125rem', marginTop: 'var(--space-sm)' }}>
                      Google Maps embed will be configured from the admin dashboard
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
