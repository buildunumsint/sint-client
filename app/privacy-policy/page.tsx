import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "../components/Navbar";

export const metadata: Metadata = {
  title: "Privacy Policy — Unum Sint",
  description:
    "How Unum Sint collects, uses, shares, retains, and protects your personal information.",
  robots: { index: true, follow: true },
};

const SUPPORT_EMAIL = "buildunumsint@gmail.com";
const LAST_UPDATED = "25 July 2026";

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
    <section id={id} className="mt-10 scroll-mt-20">
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="mt-4 space-y-4 text-gray-700">{children}</div>
    </section>
  );
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return <h3 className="font-semibold text-[#171717]">{children}</h3>;
}

export default function PrivacyPolicyPage() {
  return (
    <div>
      <Navbar />
      <main className="min-h-screen bg-white text-[#171717]">
        <div className="mx-auto max-w-2xl px-6 py-16">
          <p className="text-sm font-medium text-[#7834bb]">Unum Sint</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Privacy Policy
          </h1>
          <p className="mt-4 text-base leading-7 text-gray-600">
            Unum Sint (the &quot;Service&quot;) is operated on behalf of the
            Catholic Diocese of Port Harcourt (the &quot;Diocese&quot;), which
            is the data controller responsible for your personal information.
            Parish and diocesan records are entered and maintained on the
            Diocese&apos;s behalf. This Privacy Policy explains how we collect,
            use, share, and protect your personal information when you use our
            mobile app and website. By using the Service, you agree to the
            practices described here.
          </p>

          <Section
            id="information-we-collect"
            title="1. Information We Collect"
          >
            <div>
              <SubHeading>1.1 Personal Information</SubHeading>
              <p className="mt-2">
                We collect Account &amp; Identification Data that you provide
                when you register or use the Service, including your name, email
                address, postal address, telephone number, date of birth, and
                profile photo.
              </p>
            </div>
            {/* TODO(analytics): PostHog is not integrated yet, so we do not
                collect interaction events, device identifiers, or crash reports.
                When PostHog is added, restore that disclosure here (a "Device
                Information" subsection) AND declare it in the Google Play Data
                Safety form so the two stay consistent. */}
            <div>
              <SubHeading>1.2 Usage Data</SubHeading>
              <p className="mt-2">
                When you use the Service, our servers automatically record basic
                technical log data such as your IP address and the date and time
                of your requests. We use this to operate and secure the Service.
                We do not currently use analytics or crash-reporting tools.
              </p>
            </div>
            <div>
              <SubHeading>1.3 Sacramental &amp; Parish Records</SubHeading>
              <p className="mt-2">
                Unum Sint is a service for members of the Catholic Church, so
                using it necessarily involves information about your faith. We
                and the parishes we serve maintain sacramental records —
                baptisms, first communions, confirmations, holy orders, and
                marriages — together with parish membership and role information.
                This information reveals your religious beliefs and is therefore
                a <span className="font-medium">special category</span> of
                personal data that receives additional protection under
                data-protection law. Some of it is provided by you during
                onboarding, and some is entered by authorized parish staff on
                your behalf. We process it on the basis of your membership of,
                and relationship with, the Church — the legitimate activities of
                a religious body in respect of its members — and, where the law
                requires it, your explicit consent, which you may withdraw at any
                time.
              </p>
            </div>
          </Section>

          <Section id="how-we-use" title="2. How We Use Your Information">
            <div>
              <SubHeading>2.1 Service Provision</SubHeading>
              <p className="mt-2">
                We use your data to provide, operate, and maintain the Service,
                including for authentication and account security, and to
                maintain parish and sacramental records. The legal basis is the
                performance of a contract and compliance with legal obligations.
              </p>
            </div>
            <div>
              <SubHeading>2.2 Communication</SubHeading>
              <p className="mt-2">
                We use your data for customer support and service
                communications. We may also send newsletters and announcements
                with your consent or based on legitimate interests. You can opt
                out of promotional messages at any time by using the
                &quot;unsubscribe&quot; link in the email, adjusting your
                account settings, or contacting us at{" "}
                <a
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className="font-medium text-[#7834bb] underline"
                >
                  {SUPPORT_EMAIL}
                </a>
                .
              </p>
            </div>
            {/* TODO(analytics): When PostHog is added, restore analytics and
                product-development purposes here and mirror them in the Data
                Safety form. */}
            <div>
              <SubHeading>2.3 Security and Fraud Prevention</SubHeading>
              <p className="mt-2">
                We use technical log data to help secure the Service and to
                prevent fraud and abuse, based on our legitimate interests.
              </p>
            </div>
          </Section>

          <Section id="how-we-share" title="3. How We Share Your Information">
            <p>We do not sell your personal information. We share it only:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <span className="font-medium">
                  With your parish and diocese.
                </span>{" "}
                Authorized parish and diocesan staff can access member and
                sacramental records they administer, in order to operate the
                Service.
              </li>
              <li>
                <span className="font-medium">With service providers</span> who
                host, maintain, and support the Service on our behalf, under
                agreements that require them to protect your data.
              </li>
              <li>
                <span className="font-medium">For legal reasons,</span> where
                required to comply with the law, enforce our terms, or protect
                the rights, safety, and security of users and the public.
              </li>
            </ul>
          </Section>

          <Section id="retention" title="4. Data Retention">
            <p>
              We keep your account and personal data for as long as your account
              is active or as needed to provide the Service. When you delete
              your account, we remove or anonymize the personal data that
              identifies you (see{" "}
              <Link
                href="/delete-account"
                className="font-medium text-[#7834bb] underline"
              >
                Delete your account
              </Link>
              ).
            </p>
            <p>
              Sacramental records are the parish&apos;s permanent canonical
              register and are retained for religious and legal record-keeping
              reasons even after an account is deleted. Where possible these
              records are disassociated from your login. A record that concerns
              more than one person — such as a marriage — cannot be erased at
              the request of a single party.
            </p>
          </Section>

          <Section id="your-rights" title="5. Your Rights and Choices">
            <p>
              Depending on where you live, you may have the right to access,
              correct, export, or delete your personal data, to object to or
              restrict certain processing, and to withdraw consent. You can:
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Update your profile details in the app.</li>
              <li>
                Delete your account in the app (Profile → Delete account) or via
                our{" "}
                <Link
                  href="/delete-account"
                  className="font-medium text-[#7834bb] underline"
                >
                  account deletion page
                </Link>
                .
              </li>
              <li>
                Contact us at{" "}
                <a
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className="font-medium text-[#7834bb] underline"
                >
                  {SUPPORT_EMAIL}
                </a>{" "}
                to exercise any of these rights.
              </li>
            </ul>
          </Section>

          <Section id="security" title="6. Data Security">
            <p>
              We use technical and organizational measures to protect your data,
              including encryption in transit, hashed passwords, and access
              controls that limit who can view records. No method of
              transmission or storage is completely secure, so we cannot
              guarantee absolute security.
            </p>
          </Section>

          <Section id="children" title="7. Children's Privacy">
            <p>
              The Service is not directed to children under 13, and we do not
              knowingly create accounts for them. Sacramental records concerning
              minors (for example, an infant baptism) are managed by the parish
              under the supervision of a parent, guardian, or authorized parish
              staff. If you believe a child has provided us personal data
              directly, contact us and we will take appropriate action.
            </p>
          </Section>

          <Section id="international" title="8. International Data Transfers">
            <p>
              Your information may be processed and stored in countries other
              than your own. Where we transfer data internationally, we take
              steps to ensure it receives an adequate level of protection
              consistent with this policy and applicable law.
            </p>
          </Section>

          <Section id="changes" title="9. Changes to This Policy">
            <p>
              We may update this Privacy Policy from time to time. When we do,
              we will revise the &quot;last updated&quot; date below and, where
              appropriate, notify you through the Service. Your continued use of
              the Service after an update means you accept the revised policy.
            </p>
          </Section>

          <Section id="contact" title="10. Contact Us">
            <p>
              The data controller for the Service is the Catholic Diocese of
              Port Harcourt. If you have questions about this Privacy Policy or
              how we handle your data, or wish to exercise your rights, contact
              us at{" "}
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="font-medium text-[#7834bb] underline"
              >
                {SUPPORT_EMAIL}
              </a>
              .
            </p>
            <p className="text-sm text-gray-500">
              Data controller: Catholic Diocese of Port Harcourt.{" "}
              {/* TODO: add the
            Cathedral's full legal name and postal address. */}
            </p>
          </Section>

          <hr className="my-10 border-gray-200" />
          <p className="text-sm text-gray-500">Last updated: {LAST_UPDATED}</p>
          <Link
            href="/"
            className="mt-4 inline-block text-sm font-medium text-[#7834bb] hover:underline"
          >
            ← Back to home
          </Link>
        </div>
      </main>
    </div>
  );
}
