import { motion } from 'framer-motion';

export default function LoveLetter({from, text}: {from?: string; text?: string}) {
  return (
    <motion.div 
      initial={{ rotate: -2 }}
      animate={{ rotate: 2 }}
      transition={{ duration: 6, repeat: Infinity, repeatType: "reverse" }}
      className="bg-[#fff9f0] p-8 rounded-lg shadow-lg max-w-md mx-auto my-6 transform rotate-[-2deg] font-[cursive]"
      style={{ 
        backgroundImage: 'repeating-linear-gradient(#fff9f0 0px, #fff9f0 24px, #e5e5e5 25px)',
        lineHeight: '25px',
      }}
    >
      <p className="text-[#333333] text-lg leading-[25px] indent-8">
        Dear love,<br/><br/>
        {text && text.length > 0 ? text : "Every moment with you feels like a dream come true. Your smile lights up my world, and your love makes every day special. I can't wait to create more beautiful memories together."}<br/><br/>
        Forever yours,<br/>
        {from ?? "XOXO"}
      </p>
    </motion.div>
  );
}