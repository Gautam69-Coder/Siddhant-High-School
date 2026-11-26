import { images } from "../../data/siteImages";

export default function PrincipalMessagePage() {
  return (
<section className="principal-page section">
            <figure className="principal-portrait"><img src={images.principalMessage} alt="Male school principal seated at his office desk"/><figcaption>Principal speaking at a school event</figcaption></figure>
            <article><p className="eyebrow">Principal's Message</p><h1>A welcoming message to every learner and family.</h1><p className="sample-note">Illustrative message pending review and approval by the school. The accompanying educator portrait is representative and does not depict the principal.</p><blockquote className="principal-quote">“Every learner should feel encouraged to ask questions, discover strengths and treat others with respect.”</blockquote><p className="lead">Dear Students and Families,</p><p>Welcome to Siddhant High School. Education is a shared journey built on curiosity, care and the confidence to keep learning. We hope every student finds encouragement to ask questions, develop their strengths and treat others with respect.</p><p>Our school community can make each day meaningful when students, families and educators work together. We look forward to supporting young people as they learn, grow and discover ways to contribute with purpose.</p><p>With warm wishes,</p><p className="principal-signature"><strong>Principal</strong><br/>Siddhant High School</p></article>
          </section>
  );
}
