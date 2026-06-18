import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <>
      <Head>
        <title>OmniForge AI - Multimodal AI Platform</title>
        <meta name="description" content="One creative operating system for every modality" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
        <nav className="flex justify-between items-center px-6 py-4 border-b border-slate-700">
          <div className="text-2xl font-bold text-white">🔥 OmniForge AI</div>
          <div className="flex gap-4">
            <Link href="/auth/login" className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
              Sign In
            </Link>
            <Link href="/auth/signup" className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700">
              Get Started
            </Link>
          </div>
        </nav>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center justify-center min-h-[calc(100vh-70px)] px-6"
        >
          <h1 className="text-6xl font-bold text-white text-center mb-6">
            One Creative Operating System for Every Modality
          </h1>

          <p className="text-xl text-gray-300 text-center max-w-2xl mb-12">
            Enterprise-grade multimodal AI platform supporting text, images, audio, music, speech, video,
            animation, documents, code, 3D assets, design, and interactive experiences.
          </p>

          <div className="flex gap-6 mb-16">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700"
            >
              Launch Platform
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 rounded-lg bg-slate-700 text-white font-semibold hover:bg-slate-600"
            >
              Learn More
            </motion.button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl">
            {[
              { icon: '📝', label: 'Text' },
              { icon: '🖼️', label: 'Images' },
              { icon: '🎬', label: 'Video' },
              { icon: '🎵', label: 'Audio' },
            ].map((item) => (
              <motion.div
                key={item.label}
                whileHover={{ y: -5 }}
                className="flex flex-col items-center gap-2 p-4 rounded-lg bg-slate-700/50 hover:bg-slate-600/50"
              >
                <div className="text-4xl">{item.icon}</div>
                <div className="text-gray-300">{item.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </main>
    </>
  );
}
