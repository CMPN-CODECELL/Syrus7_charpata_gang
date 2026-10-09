import { useState } from 'react'
import {
  AlertTriangle,
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  ChevronRight,
  HelpCircle,
  MessageSquare,
  Send,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'

const PROMPT_CHIPS = [
  'Which department is at highest risk?',
  'Explain the radiology backlog.',
  'Predict congestion in six hours.',
  'Simulate a 30% arrival increase.',
]

const PROMPT_RESPONSES = {
  'Which department is at highest risk?': {
    title: 'Emergency is at the highest risk of a bottleneck.',
    subtitle: 'Capacity pressure can spread when arrivals increase and transfers slow down.',
    drivers: [
      { id: '01', title: 'Arrival surge', desc: 'Demand can rise above the expected baseline.' },
      { id: '02', title: 'Transfer delay', desc: 'Slower handoffs keep patients in upstream areas longer.' },
      { id: '03', title: 'Bed constraint', desc: 'Limited suitable beds reduce downstream flow.' },
    ],
    load: '114%',
    breachTime: '1h 42m',
    deptsAffected: '4',
    recommendation: 'Review flex-bed availability and discharge coordination with authorized staff.',
  },
  'Explain the radiology backlog.': {
    title: 'Radiology is facing scheduled scan compounding.',
    subtitle: 'CT-2 offline status combined with emergency intake drives scan queue expansion.',
    drivers: [
      { id: '01', title: 'Scanner downtime', desc: 'CT-2 servicing deficit drops rated throughput by 40%.' },
      { id: '02', title: 'Emergency stat scans', desc: 'Unscheduled ED admissions preempt routine imaging slots.' },
      { id: '03', title: 'Staff shift turnover', desc: 'Technician gap during evening transition hours.' },
    ],
    load: '117%',
    breachTime: '3h 50m',
    deptsAffected: '3',
    recommendation: 'Authorize technician overtime and divert 15 routine outpatients.',
  },
}

export default function CommandCentre() {
  const [inputPrompt, setInputPrompt] = useState('')
  const [currentResponse, setCurrentResponse] = useState(
    PROMPT_RESPONSES['Which department is at highest risk?']
  )
  const [activeChip, setActiveChip] = useState('Which department is at highest risk?')

  function handleSelectChip(chipText) {
    setActiveChip(chipText)
    setInputPrompt(chipText)
    if (PROMPT_RESPONSES[chipText]) {
      setCurrentResponse(PROMPT_RESPONSES[chipText])
    } else {
      setCurrentResponse({
        title: `Simulated projection for: "${chipText}"`,
        subtitle: 'Dynamic inference model ran on live hospital telemetry.',
        drivers: [
          { id: '01', title: 'Inflow elevation', desc: 'Surge propagates through primary triage.' },
          { id: '02', title: 'Diagnostic buffer', desc: 'Queue build-up slows patient disposition.' },
          { id: '03', title: 'Bed allocation', desc: 'Bed coordination required to prevent hallway boarding.' },
        ],
        load: '109%',
        breachTime: '2h 15m',
        deptsAffected: '3',
        recommendation: 'Notify department lead to activate surge tier 2 staffing.',
      })
    }
  }

  function handleSendPrompt(e) {
    e.preventDefault()
    if (!inputPrompt.trim()) return
    handleSelectChip(inputPrompt)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Top Section: Prompt Bar */}
      <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#0d9488', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
            <Sparkles size={16} />
          </div>
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: 0 }}>What would you like to know?</h2>
            <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
              Ask about risks, causes, scenarios, or preventive actions.[cite: 11]
            </p>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSendPrompt} style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
          <input
            type="text"
            placeholder="Ask CarePulse AI...[cite: 11]"
            value={inputPrompt}
            onChange={e => setInputPrompt(e.target.value)}
            style={{
              flex: 1,
              padding: '12px 16px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              fontSize: '13px',
              outline: 'none',
              background: '#f8fafc',
            }}
          />
          <button
            type="submit"
            style={{
              background: '#0d9488',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              padding: '0 20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Send size={16} />
          </button>
        </form>

        {/* Prompt Chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '14px' }}>
          {PROMPT_CHIPS.map(chip => (
            <button
              key={chip}
              type="button"
              onClick={() => handleSelectChip(chip)}
              style={{
                border: '1px solid #e2e8f0',
                background: activeChip === chip ? '#0f172a' : '#f8fafc',
                color: activeChip === chip ? '#ffffff' : '#475569',
                padding: '6px 12px',
                borderRadius: '999px',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {chip}[cite: 11]
            </button>
          ))}
        </div>
      </div>

      {/* 2-Column Content Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(320px, 1fr)', gap: '20px' }}>
        {/* Left Column: CarePulse Analysis */}
        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div>
                <strong style={{ fontSize: '13px', color: '#0f172a', display: 'block' }}>CarePulse analysis[cite: 11]</strong>
                <span style={{ fontSize: '11px', color: '#94a3b8' }}>Generated from synthetic operational data[cite: 11]</span>
              </div>
              <span style={{ fontSize: '10px', fontWeight: 800, padding: '2px 8px', borderRadius: '4px', background: '#eff6ff', color: '#2563eb' }}>
                Demo analysis[cite: 11]
              </span>
            </div>

            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0' }}>
              {currentResponse.title}
            </h3>
            <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 20px 0' }}>
              {currentResponse.subtitle}
            </p>

            {/* 3 Driver Cards (01, 02, 03) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '22px' }}>
              {currentResponse.drivers.map(driver => (
                <div key={driver.id} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '14px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 900, color: '#0d9488', display: 'block' }}>{driver.id}[cite: 11]</span>
                  <strong style={{ fontSize: '12px', color: '#0f172a', display: 'block', margin: '4px 0 2px 0' }}>{driver.title}[cite: 11]</strong>
                  <p style={{ margin: 0, fontSize: '11px', color: '#64748b', lineHeight: 1.4 }}>{driver.desc}[cite: 11]</p>
                </div>
              ))}
            </div>

            {/* Metrics Row: Projected load, Time to breach, Departments affected */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', borderTop: '1px solid #f1f5f9', paddingTop: '16px', marginBottom: '22px' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>Projected load[cite: 11]</span>
                <strong style={{ fontSize: '24px', fontWeight: 900, color: '#0f172a' }}>{currentResponse.load}[cite: 11]</strong>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>Estimated time to breach[cite: 11]</span>
                <strong style={{ fontSize: '24px', fontWeight: 900, color: '#0f172a' }}>{currentResponse.breachTime}[cite: 11]</strong>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>Departments affected[cite: 11]</span>
                <strong style={{ fontSize: '24px', fontWeight: 900, color: '#0f172a' }}>{currentResponse.deptsAffected}[cite: 11]</strong>
              </div>
            </div>

            {/* Action Bar */}
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle2 size={18} color="#16a34a" />
                <div>
                  <span style={{ fontSize: '10px', fontWeight: 800, color: '#166534', display: 'block' }}>Recommended next step[cite: 11]</span>
                  <span style={{ fontSize: '12px', color: '#14532d', fontWeight: 600 }}>{currentResponse.recommendation}[cite: 11]</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => alert(`Review action committed: ${currentResponse.recommendation}`)}
                style={{ background: '#0d9488', border: 'none', color: '#ffffff', padding: '8px 16px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
              >
                Review action[cite: 11]
              </button>
            </div>
          </div>

          <span style={{ fontSize: '10px', color: '#94a3b8', marginTop: '16px', display: 'block' }}>
            Illustrative prototype analysis only. Not a live forecast.[cite: 11]
          </span>
        </div>

        {/* Right Column: Prompts List & AI Guardrails Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Conversation History Card */}
          <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <strong style={{ fontSize: '13px', color: '#0f172a', display: 'block' }}>Conversation[cite: 11]</strong>
            <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '14px' }}>Recent prototype prompts[cite: 11]</span>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { title: 'Emergency capacity risk', tag: 'Demo insight' },
                { title: 'Radiology backlog', tag: 'Demo insight' },
                { title: 'Arrival surge scenario', tag: 'Demo insight' },
              ].map(item => (
                <div
                  key={item.title}
                  onClick={() => handleSelectChip(item.title)}
                  style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <span style={{ fontSize: '11px', fontWeight: 600, color: '#334155' }}>{item.title}[cite: 11]</span>
                  <span style={{ fontSize: '9px', fontWeight: 700, background: '#eff6ff', color: '#2563eb', padding: '2px 6px', borderRadius: '4px' }}>
                    {item.tag}[cite: 11]
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Guardrails Card */}
          <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <strong style={{ fontSize: '13px', color: '#0f172a', display: 'block', marginBottom: '8px' }}>AI guardrails[cite: 11]</strong>
            <p style={{ margin: 0, fontSize: '11px', color: '#64748b', lineHeight: 1.6 }}>
              CarePulse explains synthetic operational scenarios and suggests actions. Clinical and operational decisions remain with authorized staff.[cite: 11]
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}