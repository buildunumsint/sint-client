import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "About Unum Sint — Digital platform for the Catholic Diocese of Port Harcourt",
  description:
    "What Unum Sint is, who it is for, what the web and mobile apps do, and how signing in — including with Google — works.",
  alternates: { canonical: "/about" },
  robots: { index: true, follow: true },
};

const SUPPORT_EMAIL = "buildunumsint@gmail.com";

const CAPABILITIES = [
  {
    title: "Database & Archive",
    body: "A secure digital record system for the Diocese, holding parish data, clergy information, and sacramental records — baptisms, first communions, confirmations, holy orders, and marriages — in one place. Only authorized clergy and parish staff can view or edit these records.",
  },
  {
    title: "Catechesis Hub",
    body: "Sermons, reflections, pastoral letters, daily readings, and diocesan-approved catechetical material, in text, audio, and video.",
  },
  {
    title: "Parish community",
    body: "A faith-based space for members of the Diocese to connect, share parish and diocesan announcements, and keep up with events.",
  },
  {
    title: "AI faith companion",
    body: "A chatbot that answers questions about the faith and points to Church teaching on doctrinal matters.",
  },
  {
    title: "Faith Quest",
    body: "A gamified learning module, built by Logic-Dev Studios, that makes catechesis engaging for younger members of the Church.",
  },
];

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mt-12 scroll-mt-20">
      <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      <div className="mt-4 space-y-4 text-gray-700 leading-relaxed">
        {children}
      </div>
    </section>
  );
}

export default function AboutPage() {
  return (
    <div>
      <Navbar />
      <main className="min-h-screen bg-white text-[#171717]">
        <div className="mx-auto max-w-3xl px-6 py-16">

          {/* Intro */}
          <p className="text-sm font-medium text-[#7834bb]">Unum Sint</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            About Unum Sint
          </h1>
          <p className="mt-6 text-base leading-7 text-gray-600">
            <span className="font-semibold text-[#171717]">Unum Sint</span> is
            the digital platform of the Catholic Diocese of Port Harcourt,
            available on the web and as a mobile app for Android and iOS. It
            brings the parishes of the Diocese into one connected space: a
            secure archive of parish and sacramental records for clergy and
            parish staff, diocesan-approved catechesis and pastoral letters,
            daily readings, parish announcements and community, and an AI faith
            companion for questions about the faith.
          </p>

          <div className="mt-10 flex justify-center">
            <Image
              src="/Diocese_Logo.png"
              alt="Coat of arms of the Catholic Diocese of Port Harcourt"
              width={220}
              height={220}
              className="h-auto w-[160px] object-contain drop-shadow-md sm:w-[200px]"
            />
          </div>

          <Section id="name" title="Where the name comes from">
            <p>
              <span className="font-semibold italic">Unum Sint</span> is drawn
              from the Latin{" "}
              <span className="italic">&ldquo;Ut omnes unum sint&rdquo;</span> —{" "}
              <span className="font-medium">
                &ldquo;That they may all be one&rdquo;
              </span>{" "}
              (John 17:21), Christ&apos;s prayer for unity within His Church.
              The platform exists to help the Diocese live out that call to
              communion: to be one body, united in mission and spirit.
            </p>
          </Section>

          <Section id="what-it-does" title="What the platform does">
            <div className="space-y-6">
              {CAPABILITIES.map((c) => (
                <div key={c.title}>
                  <h3 className="font-semibold text-[#171717]">{c.title}</h3>
                  <p className="mt-2">{c.body}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section id="who-runs-it" title="Who builds and runs it">
            <p>
              Unum Sint is developed for, and operated on behalf of, the{" "}
              <span className="font-medium">
                Catholic Diocese of Port Harcourt
              </span>
              , which is the data controller for the information held in the
              platform. Parish and diocesan records are entered and maintained
              on the Diocese&apos;s behalf by authorized clergy and parish
              staff.
            </p>
          </Section>

          <Section id="accounts" title="Accounts and sign-in">
            <div>
              <h3 className="font-semibold text-[#171717]">Who can use it</h3>
              <p className="mt-2">
                Unum Sint is built for the parishioners, clergy, and parish
                staff of the Catholic Diocese of Port Harcourt. Anyone can read
                this page and learn what the platform does without an account.
                An account is only needed to take part in the community, follow
                catechesis, or — for authorized clergy and parish staff — to
                work with parish and sacramental records.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-[#171717]">
                Signing in with Google
              </h3>
              <p className="mt-2">
                In the Unum Sint mobile app you can create an account with an
                email address and password, or choose{" "}
                <span className="font-medium">
                  &ldquo;Continue with Google&rdquo;
                </span>
                . If you choose Google, Google asks your permission to share
                your basic profile information — your name, email address, and
                profile picture. We use that information for one purpose only:
                to create your Unum Sint account and sign you in.
              </p>
              <p className="mt-4">
                We do <span className="font-medium">not</span> request access to
                Gmail, Google Drive, Google Contacts, Google Calendar, or any
                other Google service, and we never post or send anything on your
                behalf. We do not sell your information or use it for
                advertising.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-[#171717]">
                Staying in control of your data
              </h3>
              <p className="mt-2">
                You can delete your Unum Sint account, and the personal data
                tied to it, at any time. Our{" "}
                <Link
                  href="/privacy-policy"
                  className="font-medium text-[#7834bb] underline underline-offset-4 hover:text-purple-950"
                >
                  Privacy Policy
                </Link>{" "}
                explains in full what we collect, why, how long we keep it, and
                the rights you have over it. The{" "}
                <Link
                  href="/delete-account"
                  className="font-medium text-[#7834bb] underline underline-offset-4 hover:text-purple-950"
                >
                  account deletion
                </Link>{" "}
                page explains how to remove your account and what happens to
                your information afterwards.
              </p>
            </div>
          </Section>

          <Section id="contact" title="Contact us">
            <p>
              Write to us at{" "}
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="font-medium text-[#7834bb] underline underline-offset-4 hover:text-purple-950"
              >
                {SUPPORT_EMAIL}
              </a>{" "}
              or call 0810 133 0277 or 0803 861 2926, and we will respond.
            </p>
          </Section>

        </div>
        <Footer />
      </main>
    </div>
  );
}
