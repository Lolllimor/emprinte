import type { Metadata } from 'next';
import Link from 'next/link';

import { Header } from '@/components/sections/Header';
import { Footer } from '@/components/sections/Footer';
import { getSiteSettings } from '@/lib/site-settings-server';

export const metadata: Metadata = {
  title: '#BuildAReader | Partnership Proposal | Emprinte Readers Hub',
  description:
    'Partnership proposal for #BuildAReader: making readers out of Africa for transformational leadership through books, mentorship, and impact.',
};

const shell =
  'mx-auto w-full max-w-[1200px] px-5 sm:px-8 lg:px-[75px] xl:max-w-[1320px] xl:px-[120px]';

const p =
  'font-poppins text-sm leading-[1.75] text-[#2d3640] sm:text-base sm:leading-[1.72]';

const card =
  'rounded-2xl border border-[#005D51]/12 bg-white p-5 shadow-sm sm:p-6';

export default async function BuildAReaderProposalPage() {
  const settings = await getSiteSettings();

  return (
    <main className="relative flex min-h-screen w-full flex-col bg-[#f4faf8]">
      <Header contactEmail={settings.contactInfo.email} />

      <article className="w-full flex-1 pb-14 pt-8 md:pb-16 md:pt-10">
        {/* Hero */}
        <div className="w-full bg-[url(/map-green.png)] bg-cover bg-center px-5 py-12 text-white sm:px-8 lg:px-[75px] xl:px-[120px]">
          <div className={`${shell} max-w-[900px]`}>
            <p className="font-poppins text-sm font-medium text-white/90">
              Emprinte Readers Hub
            </p>
            <h1 className="mt-2 font-lora text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
              #BuildAReader
            </h1>
            <p className="mt-4 max-w-2xl font-poppins text-base text-white/95 sm:text-lg">
              Making Readers out of Africa for Transformational Leadership — Partnership
              Proposal
            </p>
            <div className="mt-6 flex flex-wrap gap-4 font-poppins text-sm text-white/90">
              <a
                href="https://www.emprintereaders.com"
                className="underline-offset-2 hover:underline"
              >
                www.emprintereaders.com
              </a>
              <span className="hidden sm:inline" aria-hidden>
                ·
              </span>
              <a
                href="mailto:projects@emprintereaders.com"
                className="underline-offset-2 hover:underline"
              >
                projects@emprintereaders.com
              </a>
            </div>
          </div>
        </div>

        <div className={`${shell} pt-10`}>
          <section aria-labelledby="challenge-heading">
            <h2
              id="challenge-heading"
              className="font-lora text-2xl font-bold text-[#142218] sm:text-3xl"
            >
              The challenge
            </h2>
            <p className={`${p} mt-4 max-w-3xl`}>
              We are facing a leadership crisis in Africa because we have a reading crisis.
              Without exposure to transformational ideas early, young people miss the chance
              to develop critical thinking, strong values, and leadership skills — factors
              essential for driving Africa&apos;s development. This literacy and leadership gap
              limits opportunities and perpetuates cycles of underdevelopment.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  title: 'Limited exposure',
                  body: 'Teenagers in many communities lack exposure to literature that can inspire personal growth and leadership.',
                },
                {
                  title: 'Limited access to transformational books',
                  body: 'Lack of engagement with life-changing books limits teenagers’ perspectives, mindset, and future opportunities.',
                },
                {
                  title: 'Missed potentials',
                  body: 'Without early development of critical thinking and values, Africa faces a persistent leadership and development challenge.',
                },
                {
                  title: 'Leadership gap',
                  body: 'The reading crisis feeds a leadership gap that holds back individuals, schools, and communities.',
                },
              ].map((item) => (
                <div key={item.title} className={card}>
                  <h3 className="font-lora text-lg font-bold text-[#005D51]">{item.title}</h3>
                  <p className={`${p} mt-2`}>{item.body}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-14" aria-labelledby="solution-heading">
            <h2
              id="solution-heading"
              className="font-lora text-2xl font-bold text-[#142218] sm:text-3xl"
            >
              How #BuildAReader works
            </h2>
            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              <div className={card}>
                <h3 className="font-lora text-lg font-bold text-[#142218]">Give. Read. Mentor.</h3>
                <p className={`${p} mt-3`}>
                  We choose an enlightening book to give out to teenagers. We select schools for
                  implementation, read with the beneficiaries, and mentor them over a year using
                  the learnings from the book.
                </p>
              </div>
              <div className={card}>
                <h3 className="font-lora text-lg font-bold text-[#142218]">Monitor progress</h3>
                <p className={`${p} mt-3`}>
                  We monitor and evaluate the beneficiaries of the #BuildAReader initiative to
                  qualify the impact the campaign has made and what to do better.
                </p>
              </div>
            </div>
            <p className={`${p} mt-8 max-w-3xl`}>
              #BuildAReader solves this challenge by placing a book in the hands of teenagers to
              serve as a catalyst for transformational reading. Our goal is to awaken the reader in
              them with one book that shifts their mindset and potentially changes the trajectory of
              their lives. Beyond that, we read with them, mentor them, and monitor their journey as
              readers. Our hope is that they grow to become leaders through the application of the
              principles in the books they read.
            </p>
            <div className={`${card} mt-8 border-[#005D51]/25 bg-[#005D51]/6`}>
              <h3 className="font-lora text-lg font-bold text-[#142218]">#BuildAReader campaign</h3>
              <p className={`${p} mt-3`}>
                We lead a campaign for people, individuals, and communities to build at least one
                reader, and we run the campaign until we hit our goal.
              </p>
            </div>
          </section>

          <section className="mt-14" aria-labelledby="emprinte-heading">
            <h2
              id="emprinte-heading"
              className="font-lora text-2xl font-bold text-[#142218] sm:text-3xl"
            >
              Emprinte Readers Hub
            </h2>
            <p className={`${p} mt-4 max-w-3xl`}>
              A community whose goal is to make readers out of Africa, who&apos;d go on to become
              transformational leaders that would change the trajectory of Africa.
            </p>
            <h3 className="mt-8 font-lora text-lg font-bold text-[#005D51] sm:text-xl">Our goals</h3>
            <ul className="mt-4 list-disc space-y-2 pl-5 font-poppins text-sm text-[#2d3640] sm:text-base">
              <li>To make 10,000 Africans committed readers within Emprinte by 2030</li>
              <li>To build the largest libraries across Africa</li>
              <li>
                To make reading fun and accessible to everyone through an immersive and innovative
                Readers App
              </li>
            </ul>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                {
                  title: 'Reading networks & structures',
                  body: 'We create vibrant reading communities that connect learners, encourage accountability, and help readers stay consistent through shared challenges, book discussions, and structured engagement.',
                },
                {
                  title: 'Growth workshops',
                  body: 'We organize focused workshops that develop essential skills such as mindset, productivity, self-awareness, leadership, and personal excellence, supporting holistic growth.',
                },
                {
                  title: 'Application bootcamps',
                  body: 'Our bootcamps teach participants how to turn what they read into real-life results, helping them apply knowledge in academics, personal development, communication, and problem-solving.',
                },
                {
                  title: 'Impact initiatives',
                  body: 'Through school outreaches and initiatives like BuildAReader, we provide books, mentorship, and reading experiences that inspire young people to read more, learn more, and become more.',
                },
              ].map((item) => (
                <div key={item.title} className={card}>
                  <h4 className="font-lora text-base font-bold text-[#142218] sm:text-lg">
                    {item.title}
                  </h4>
                  <p className={`${p} mt-2`}>{item.body}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-14" aria-labelledby="impact-heading">
            <h2
              id="impact-heading"
              className="font-lora text-2xl font-bold text-[#142218] sm:text-3xl"
            >
              Impact so far
            </h2>
            <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-3">
              {[
                { stat: '350+', label: 'Readers built' },
                { stat: '5', label: 'Schools impacted' },
                { stat: '3', label: 'States covered' },
                { stat: '20+', label: 'Bootcamps & workshops' },
                { stat: '~400', label: 'Books delivered for impact' },
                { stat: '3,000+', label: 'Lives impacted' },
              ].map((item) => (
                <div key={item.label} className={`${card} text-center`}>
                  <p className="font-lora text-2xl font-bold text-[#005D51] sm:text-3xl">
                    {item.stat}
                  </p>
                  <p className="mt-1 font-poppins text-sm text-[#5a6570] sm:text-base">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-14" aria-labelledby="sponsor-heading">
            <h2
              id="sponsor-heading"
              className="font-lora text-2xl font-bold text-[#142218] sm:text-3xl"
            >
              Sponsorship packages
            </h2>
            <p className={`${p} mt-4`}>Tiers from literacy sponsor to school builder (Nigerian Naira).</p>
            <div className="mt-8 overflow-x-auto rounded-2xl border border-[#005D51]/12 bg-white shadow-sm">
              <table className="w-full min-w-[640px] border-collapse text-left font-poppins text-sm">
                <thead>
                  <tr className="border-b border-[#005D51]/15 bg-[#005D51]/8">
                    <th className="px-4 py-3 font-semibold text-[#142218] sm:px-5">Tier</th>
                    <th className="px-4 py-3 font-semibold text-[#142218] sm:px-5">Package</th>
                    <th className="px-4 py-3 font-semibold text-[#142218] sm:px-5">Investment</th>
                    <th className="px-4 py-3 font-semibold text-[#142218] sm:px-5">Books</th>
                    <th className="px-4 py-3 font-semibold text-[#142218] sm:px-5">Key benefits</th>
                  </tr>
                </thead>
                <tbody className="text-[#2d3640]">
                  {[
                    {
                      tier: 'Tier #4',
                      name: 'School Builder',
                      cost: 'N1,250,000',
                      books: '500',
                      benefits:
                        'Headline branding on banner; executive speaking slot at school visit; CSR asset (impact documentary); press & media headline mention.',
                    },
                    {
                      tier: 'Tier #3',
                      name: 'Class Adopter',
                      cost: 'N250,000',
                      books: '100',
                      benefits:
                        'Visual visibility on banner; company branding on 100 books; digital PR on social media; impact data for CSR report.',
                    },
                    {
                      tier: 'Tier #2',
                      name: 'Literacy Sponsor',
                      cost: 'N125,000',
                      books: '50',
                      benefits: 'Shared branding; social media PR; recognition proof; impact data.',
                    },
                    {
                      tier: 'Tier #1',
                      name: 'Mobility Sponsor',
                      cost: 'N75,000',
                      books: '30',
                      benefits:
                        'Visual visibility as logistics partner; stories shoutout on social media; web listing; impact report.',
                    },
                  ].map((row) => (
                    <tr key={row.name} className="border-b border-[#005D51]/10 last:border-0">
                      <td className="px-4 py-4 align-top font-medium text-[#005D51] sm:px-5">
                        {row.tier}
                      </td>
                      <td className="px-4 py-4 align-top font-semibold text-[#142218] sm:px-5">
                        {row.name}
                      </td>
                      <td className="px-4 py-4 align-top sm:px-5">{row.cost}</td>
                      <td className="px-4 py-4 align-top sm:px-5">{row.books}</td>
                      <td className="px-4 py-4 align-top text-[#2d3640] sm:px-5">{row.benefits}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="mt-14" aria-labelledby="benefits-heading">
            <h2
              id="benefits-heading"
              className="font-lora text-2xl font-bold text-[#142218] sm:text-3xl"
            >
              Partnership benefits
            </h2>
            <ol className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                {
                  n: '01',
                  title: 'CSR report',
                  body: 'We provide a comprehensive impact report (photos, data, testimonials) for your annual sustainability report.',
                },
                {
                  n: '02',
                  title: 'Community engagement',
                  body: 'Opportunity for your staff to volunteer as “Reading Mentors” on school visit days.',
                },
                {
                  n: '03',
                  title: 'Brand visibility',
                  body: 'Your logo placed directly in the hands of 500 students and their families (at the School Builder tier).',
                },
              ].map((item) => (
                <li key={item.n} className={card}>
                  <span className="font-lora text-3xl font-bold text-[#005D51]/40">{item.n}</span>
                  <h3 className="mt-2 font-lora text-lg font-bold text-[#142218]">{item.title}</h3>
                  <p className={`${p} mt-2`}>{item.body}</p>
                </li>
              ))}
            </ol>
          </section>

          <section
            className="mt-14 rounded-2xl bg-[#005D51] px-6 py-10 text-white sm:px-10"
            aria-labelledby="cta-heading"
          >
            <h2 id="cta-heading" className="font-lora text-2xl font-bold sm:text-3xl">
              Make a difference
            </h2>
            <p className="mt-4 max-w-2xl font-poppins text-base text-white/95">
              Support the campaign to hit our goal of building 500 readers in the #BuildAReader
              initiative by choosing a sponsorship package today. Ready to make an impact? Contact
              us today to secure your preferred sponsorship tier.
            </p>
            <a
              href="mailto:projects@emprintereaders.com?subject=%23BuildAReader%20sponsorship"
              className="mt-6 inline-flex h-12 items-center justify-center rounded-xl bg-[#E63715] px-6 font-poppins text-sm font-semibold text-white transition hover:bg-[#c42f12] sm:text-base"
            >
              Contact us
            </a>
          </section>

          <section className="mt-14" aria-labelledby="team-heading">
            <h2
              id="team-heading"
              className="font-lora text-2xl font-bold text-[#142218] sm:text-3xl"
            >
              Meet the team
            </h2>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                ['Abiola Okunsanya', 'Founder & President'],
                ['Gabriel Owolabi', 'Co-Founder & Director'],
                ['Quadri Morin', 'Creative Director'],
                ['Dorcas Ajayi', 'Co-Founder & Director'],
                ['Adepeju Adepegba', 'Executive Secretary & Director'],
                ['Eniola Orisadare', 'Communications Manager'],
              ].map(([name, role]) => (
                <li key={name} className={card}>
                  <p className="font-lora text-base font-bold text-[#142218] sm:text-lg">{name}</p>
                  <p className="mt-1 font-poppins text-sm text-[#5a6570]">{role}</p>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-14 border-t border-[#005D51]/15 pt-10" aria-labelledby="contact-heading">
            <h2
              id="contact-heading"
              className="font-lora text-2xl font-bold text-[#142218] sm:text-3xl"
            >
              Contact us
            </h2>
            <ul className={`${p} mt-4 space-y-2`}>
              <li>
                <a
                  href="https://www.emprintereaders.com"
                  className="font-semibold text-[#005D51] underline-offset-2 hover:underline"
                >
                  www.emprintereaders.com
                </a>
              </li>
              <li>
                <a
                  href="mailto:projects@emprintereaders.com"
                  className="font-semibold text-[#005D51] underline-offset-2 hover:underline"
                >
                  projects@emprintereaders.com
                </a>
              </li>
              <li>
                Adepeju:{' '}
                <a href="tel:+2348168211428" className="text-[#005D51] underline-offset-2 hover:underline">
                  +234 816 821 1428
                </a>
              </li>
              <li>
                Abiola:{' '}
                <a href="tel:+2349061311757" className="text-[#005D51] underline-offset-2 hover:underline">
                  +234 906 131 1757
                </a>
              </li>
            </ul>
            <p className={`${p} mt-8`}>
              <Link
                href="/"
                className="font-semibold text-[#005D51] underline-offset-2 hover:underline"
              >
                ← Back to home
              </Link>
            </p>
          </section>
        </div>
      </article>

      <Footer contactInfo={settings.contactInfo} />
    </main>
  );
}
