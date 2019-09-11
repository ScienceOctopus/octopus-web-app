import React, { Component } from "react";

class FAQPage extends Component {
  render() {
    return (
      <main className="ui text container">
        <h1>Frequently Asked Questions</h1>

        <h3>Why would I want to publish in Octopus?</h3>
        <p>
          Octopus is designed to replace journals and papers as the place to
          publish scientific research. The traditional system is not only slow
          and expensive, but the concept of ‘papers’ is not a good way of
          disseminating scientific work in the 21st century. By forcing people
          to share their work only when they get to the end of what can be a
          very long research process, it slows down the spread of scientific
          knowledge, and encourages ‘questionable research practices’ in order
          for researchers to produce seemingly easy, clear narratives that will
          get their work widely read. Good science isn't necessarily a good
          story. Good science can be the careful collection of a small amount of
          data, or careful analysis of data collected by someone else, or a good
          hypothesis (regardless of whether data later supports it or not).
        </p>

        <p>
          Publishing in Octopus is free, fast, and meritocratic. Why hold on to
          a hypothesis? Publish it now and establish priority – once it’s out in
          Octopus it’s yours. Why hold onto your data? Publish that now and
          regardless of what analyses are done by you or others later, the
          credit for that data is yours.
        </p>

        <h3>How do I publish?</h3>
        <p>
          Octopus currently accepts 8 types of publication (though we are
          building the infrastructure to support custom types for different
          fields and research types) — all must be linked to another publication
          somewhere in Octopus. The top of any ‘chain’ is a publication that is
          defining a scientific Problem. Below that you can publish a
          Hypothesis, below that a Method/Protocol, below that Data/Results,
          below that Analysis, below that Discussion and below that Applications
          or translations in the real world. Reviews can be published attached
          to any of those 7 other types of publication.
        </p>

        <p>
          To publish, click on the pencil icon and follow the steps to upload
          your manuscript or use the online editor.
        </p>

        <h3>What about copyright?</h3>
        <p>When Octopus is out of beta-testing and ready for real-life use, you will be able
          to select a Creative Commons copyright label. This will ensure that you can
           retain your intellectual property rights as the author, but that others
          can use your work in the way that you want.
        </p>


        <h3>What is the rating system?</h3>
        <p>
          Every publication in Octopus can be rated by logged-in readers (i.e.
          people with an ORCID ID). Each type of publication has 3 pre-defined
          criteria on which you are asked to rate it. These allow us to define
          what we as a scientific community consider ‘good science’, and allow
          authors to get truly meritocratic feedback and reward for their work.
        </p>

        <p>
          Everything you rate will be associated with your username, so it will
          be obvious if you rate people in a partisan manner.
        </p>

        <h3>Can I publish in both Octopus and a journal?</h3>
        <p>
          Octopus is designed to replace journals, but we recognise that many
          people will initially want to publish in both. Journal policies differ
          in how they treat material that has been previously published, such as
          on a preprint server. We recommend that you check whether your
          intended journal objects before publishing in Octopus.
        </p>

        <h3>Won’t people steal my ideas/data if I publish it?</h3>
        <p>
          Once you’ve published something, it can’t be stolen – it’s yours.
          Publishing to Octopus quickly can establish your priority. If your
          hypothesis is later supported by data, it doesn’t matter whether that
          data is collected by you or someone else or by many people: it’s you
          that published the hypothesis and you that gets the credit for that.
          Similarly, if you have published the data, that’s a publication
          already under your belt. You can also publish an analysis of that data – and so can
          other people.
        </p>

        <h3>Does each publication get a DOI?</h3>
        <p>
          In the future, yes. We are working to implement DOIs for each publication in Octopus,
          just like for any other kind of publication. At the moment, for beta testing, we are using our own unique IDs.
        </p>

        <h3>If this is only a beta version, when will Octopus launch?</h3>
        <p>This is our first major iteration of Octopus, and we are collating
        feedback whilst we add in the rest of the features we want for launch.
         We hope to launch fully in spring 2020. If you want to help, please
        email alex.freeman@maths.cam.ac.uk!
          </p>

        <h3>Why would I write a public review?</h3>
        <p>
          Reviewing and rating is critical to good science. Open peer review,
          where readers can read the reviews and opinions of others is important
          as it allows people to learn from the views of those with different
          experience and knowledge. In Octopus, a review is treated as an equal
          type of publication to any other, so every review you write will
          itself appear attached to your individual publication list and will be
          rated by others. Treat it as carefully as any other piece of work you
          publish – and enjoy the credit you will get as a result.
        </p>

        <p>
          Some people are concerned about writing open critiques of others’
          work. We believe that no one writing a genuine, well-argued critique
          of another’s work is likely to face any backlash, but are considering
          implementing a system whereby ALL publications in Octopus remain
          anonymous for their first few months, allowing double-blind reviewing.
        </p>

        <h3>How do I format my publications?</h3>
        <p>
          Because each publication in Octopus is smaller than an old-fashioned
          paper, you will no longer need to spend time writing an
          Introduction etc for each publication. What you will now publish as a
          Problem will be roughly the equivalent to a traditional paper’s introduction. A Hypothesis
          directly following that will therefore no longer need to include all
          the information in that Problem, though may refer to other publications that
          support the scientific basis for the hypothesis. Similarly, publishing
          Results/Data will no longer require you to write out the Method,
          merely link to the published Method you followed, and add only
          relevant specific details (such as the dates of data collection, batch
          numbers of reagents, model numbers of equipment etc).
        </p>

        <p>
          References should no longer all be listed at the end of a publication.
          Since all publication is now online, direct embedded permanent URLs
          (eg. DOIs) should be used. Acknowledgements should still be given at
          the end of a publication.
        </p>

        <p>
          For researchers in biomedical sciences, the EQUATOR guidelines on
          reporting should still be followed.
        </p>

        <p>You can format your own publications in the online editor within Octopus
        to be sure that you get it to look exactly as you want. No more enforced styles, limited words or figures/tables.
         And no more time/money wasted proof-reading and sending comments back to Editors.
        </p>

        <h3>
          Someone has pointed out a really important issue in a review – can I
          retract?
        </h3>
        <p>
          No need for retraction for an innocent oversight. You can reversion
          your publication (although this feature is not in the current beta prototype). The old version will still exist on file, but the
          new one will replace it. If a reviewer made such an important point,
          do consider offering them co-authorship, but at the minimum, add an
          acknowledgement.
        </p>

        <h3>I think a publication should be retracted!</h3>
        <p>
          If you suspect plagiarism, copyright issues, ethical or scientific
          misconduct then you will be able to click on ‘rate this publication’ and use the Red Flag
          system to raise your concerns (again, a feature not currently in this beta prototype. This will email the corresponding
          author and you will enter a ‘dispute resolution’ centre. The
          publication will immediately be flagged so that it is clear to others
          that an issue has been raised. If the dispute is not quickly resolved,
          the issue will be escalated to the corresponding author’s
          institutional Research Integrity Office, or their national office.
        </p>
      </main>
    );
  }
}

export default FAQPage;
