import React from 'react';
import { Users, ShieldCheck, Clock, TrendingUp, Sparkles } from 'lucide-react';

const coreValues = [
  {
    icon: <Users size={22} />,
    title: 'People First',
    desc: 'We value individuals and believe in creating equal opportunities for all.',
  },
  {
    icon: <ShieldCheck size={22} />,
    title: 'Integrity',
    desc: 'We maintain transparency and ethical practices in everything we do.',
  },
  {
    icon: <Clock size={22} />,
    title: 'Responsiveness',
    desc: 'We ensure timely communication and support.',
  },
  {
    icon: <TrendingUp size={22} />,
    title: 'Growth Together',
    desc: 'We work towards the growth of both individuals and businesses.',
  },
];

export default function ValuesSection() {
  return (
    <section className="values-section" id="our-values">
      <div className="container">
        <div className="values-header">
          <div className="values-eyebrow">
            <Sparkles size={13} style={{ display: 'inline', marginRight: '6px' }} />
            <span>OUR VALUES</span>
          </div>
          <h2 className="values-title">Guiding Principles That Drive Us</h2>
        </div>

        <div className="values-grid">
          {coreValues.map((val, idx) => (
            <div key={idx} className="value-col">
              <div className="value-icon-box">{val.icon}</div>
              <h3 className="value-heading">{val.title}</h3>
              <p className="value-desc">{val.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
