import React from 'react'

const Footer = () => {
  return (
     <footer className="py-6 text-center text-xs text-slate-600 dark:text-slate-400 font-semibold border-t border-slate-200 dark:border-slate-800 glass-card bg-white/95 dark:bg-slate-950/80">
        Smart Bonafide Certificate Issuance & QR Verification Engine &copy; {new Date().getFullYear()} Institution Digital System
      </footer>
  )
}

export default Footer