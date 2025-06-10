import ElementCreator from "../../shared/element-creator";
import "./about.css";

export default class AboutView {
  private readonly aboutContainer: ElementCreator;

  constructor() {
    this.aboutContainer = new ElementCreator({
      tag: "div",
      className: ["about-container"],
      textContent: "",
    });

    this.configureView();
  }

  public getElement(): HTMLElement {
    return this.aboutContainer.getElement();
  }

  private configureView(): void {
    window.removeEventListener("hashchange", changeVisibleMembers);

    const titleAboutUs = new ElementCreator({
      tag: "h2",
      className: ["about-us-title"],
      textContent: "About us",
    });

    const text = new ElementCreator({
      tag: "p",
      className: ["text-about-aur-work"],
      textContent:
        "Our team followed an Agile workflow, holding daily standups in Discord, managing tasks via Trello, and organizing weekly Zoom meetings to discuss progress and challenges in depth. Each team member took ownership of their responsibilities while actively supporting others — whether through debugging, code reviews, or UI discussions. Regular communication and openness to feedback fostered a collaborative and supportive environment, resulting in a well-structured and polished final product.",
    });

    const teamContainer = new ElementCreator({
      tag: "div",
      className: ["team"],
    });

    const member1Container = new ElementCreator({
      tag: "div",
      className: ["team-member"],
    });

    const photo1Container = new ElementCreator({
      tag: "div",
      className: ["photo"],
    });

    const photo1 = new ElementCreator({
      tag: "img",
      className: ["photo"],
      textContent: "",
      attributes: {
        src: "./img/Vika.PNG",
        alt: "Vika",
      },
    });

    photo1Container.addInnerElement(photo1.getElement());
    member1Container.addInnerElement(photo1Container.getElement());

    const discriptionContainer1 = new ElementCreator({
      tag: "div",
      className: ["description"],
    });

    const nameMember1 = new ElementCreator({
      tag: "h3",
      className: ["title-text"],
      textContent: "Victoria Nasonova ",
    });

    const gitHubMember1 = new ElementCreator({
      tag: "a",
      className: ["title-text"],
      textContent: "GitHub: nasoviva",
      attributes: {
        href: "https://github.com/nasoviva",
      },
    });

    nameMember1.addInnerElement(gitHubMember1.getElement());

    const descriptionMember1 = new ElementCreator({
      tag: "p",
      className: ["text-element"],
      textContent:
        "Victoria is an aspiring junior frontend developer with a background in economics who transitioned into tech through intensive training at School 42. She is currently advancing her skills in JavaScript and React at RS School. In addition to coding, she has hands-on experience with no-code platforms such as UIBakery, Tilda, and Carrd. Victoria has a strong passion for building clean, responsive, and user-friendly interfaces.",
    });

    const titleContributionsMemeber1 = new ElementCreator({
      tag: "h3",
      className: ["title-text"],
      textContent: "Contributions to the project",
    });

    const contributionsContainerMember1 = new ElementCreator({
      tag: "ul",
      className: ["text-element"],
      textContent: "",
    });

    const contribution1Member1 = new ElementCreator({
      tag: "li",
      className: ["text-element"],
      textContent:
        "● Implemented the header component with responsive navigation.",
    });

    const contribution2Member1 = new ElementCreator({
      tag: "li",
      className: ["text-element"],
      textContent: "● Set up application pages routing.",
    });

    const contribution3Member1 = new ElementCreator({
      tag: "li",
      className: ["text-element"],
      textContent:
        "● Developed the frontend for login and registration pages, including form validation and error handling.",
    });

    const contribution4Member1 = new ElementCreator({
      tag: "li",
      className: ["text-element"],
      textContent:
        "● Built the product catalog, including a grid layout with pagination.",
    });

    contributionsContainerMember1.addInnerElement(
      contribution1Member1.getElement(),
    );
    contributionsContainerMember1.addInnerElement(
      contribution2Member1.getElement(),
    );
    contributionsContainerMember1.addInnerElement(
      contribution3Member1.getElement(),
    );
    contributionsContainerMember1.addInnerElement(
      contribution4Member1.getElement(),
    );

    discriptionContainer1.addInnerElement(nameMember1.getElement());
    discriptionContainer1.addInnerElement(descriptionMember1.getElement());
    discriptionContainer1.addInnerElement(
      titleContributionsMemeber1.getElement(),
    );
    discriptionContainer1.addInnerElement(
      contributionsContainerMember1.getElement(),
    );

    member1Container.addInnerElement(discriptionContainer1.getElement());
    teamContainer.addInnerElement(member1Container.getElement());

    const member2Container = new ElementCreator({
      tag: "div",
      className: ["team-member"],
    });

    const photo2Container = new ElementCreator({
      tag: "div",
      className: ["photo"],
    });

    const photo2 = new ElementCreator({
      tag: "img",
      className: ["photo"],
      textContent: "",
      attributes: {
        src: "./img/Anton.PNG",
        alt: "Anton",
      },
    });

    photo2Container.addInnerElement(photo2.getElement());
    member2Container.addInnerElement(photo2Container.getElement());

    const discriptionContainer2 = new ElementCreator({
      tag: "div",
      className: ["description"],
    });

    const nameMember2 = new ElementCreator({
      tag: "h3",
      className: ["title-text"],
      textContent: "Anton Smelchakov ",
    });

    const gitHubMember2 = new ElementCreator({
      tag: "a",
      className: ["title-text"],
      textContent: "GitHub: antonsmelchakov",
      attributes: {
        href: "https://github.com/antonsmelchakov",
      },
    });

    nameMember2.addInnerElement(gitHubMember2.getElement());

    const descriptionMember2 = new ElementCreator({
      tag: "p",
      className: ["text-element"],
      textContent:
        "Anton is an aspiring junior frontend developer. Finished Penza State University in 2015 with a degree of engineer on a faculty of Automation and Telemechanics. With a experience in various fields such as an industrial engineering(food) and theater he now seeks to achieve proficiency in coding as well. Striving for elegance and thoughtful design he hopes to bring the best code possible to provide quality experience for both his colleagues and the eventual users.",
    });

    const titleContributionsMemeber2 = new ElementCreator({
      tag: "h3",
      className: ["title-text"],
      textContent: "Contributions to the project",
    });

    const contributionsContainerMember2 = new ElementCreator({
      tag: "ul",
      className: ["text-element"],
      textContent: "",
    });

    const contribution1Member2 = new ElementCreator({
      tag: "li",
      className: ["text-element"],
      textContent: "● Module for interacting with CommerceTools API.",
    });

    const contribution2Member2 = new ElementCreator({
      tag: "li",
      className: ["text-element"],
      textContent:
        "● Various adjacent utilities such as parser for server responses and toast-messages.",
    });

    const contribution3Member2 = new ElementCreator({
      tag: "li",
      className: ["text-element"],
      textContent: "● Implemented «Profile page» and «Basket page».",
    });

    const contribution4Member2 = new ElementCreator({
      tag: "li",
      className: ["text-element"],
      textContent:
        "● Small tweaks for existing code, such as custom element builder.",
    });

    contributionsContainerMember2.addInnerElement(
      contribution1Member2.getElement(),
    );
    contributionsContainerMember2.addInnerElement(
      contribution2Member2.getElement(),
    );
    contributionsContainerMember2.addInnerElement(
      contribution3Member2.getElement(),
    );
    contributionsContainerMember2.addInnerElement(
      contribution4Member2.getElement(),
    );

    discriptionContainer2.addInnerElement(nameMember2.getElement());
    discriptionContainer2.addInnerElement(descriptionMember2.getElement());
    discriptionContainer2.addInnerElement(
      titleContributionsMemeber2.getElement(),
    );
    discriptionContainer2.addInnerElement(
      contributionsContainerMember2.getElement(),
    );

    member2Container.addInnerElement(discriptionContainer2.getElement());
    teamContainer.addInnerElement(member2Container.getElement());

    const member3Container = new ElementCreator({
      tag: "div",
      className: ["team-member"],
    });

    const photo3Container = new ElementCreator({
      tag: "div",
      className: ["photo"],
    });

    const photo3 = new ElementCreator({
      tag: "img",
      className: ["photo"],
      textContent: "",
      attributes: {
        src: "./img/Sergey.jpg",
        alt: "Sergey",
      },
    });

    photo3Container.addInnerElement(photo3.getElement());
    member3Container.addInnerElement(photo3Container.getElement());

    const discriptionContainer3 = new ElementCreator({
      tag: "div",
      className: ["description"],
    });

    const nameMember3 = new ElementCreator({
      tag: "h3",
      className: ["title-text"],
      textContent: "Sergey Malkov ",
    });

    const gitHubMember3 = new ElementCreator({
      tag: "a",
      className: ["title-text"],
      textContent: "GitHub: dedal88",
      attributes: {
        href: "https://github.com/dedal88",
      },
    });

    nameMember3.addInnerElement(gitHubMember3.getElement());

    const descriptionMember3 = new ElementCreator({
      tag: "p",
      className: ["text-element"],
      textContent:
        "Sergey is an aspiring junior frontend developer with a higher technical education in the specialty Automation of technological processes and production. He has experience in such areas of information technology as technical support, system administration, information security. Currently, he is improving his skills in the field of web development, being a student of RS School. He has certificates in web development from codecademy.com. Sergey enjoys working with professionals and strives for professionalism himself.",
    });

    const titleContributionsMemeber3 = new ElementCreator({
      tag: "h3",
      className: ["title-text"],
      textContent: "Contributions to the project",
    });

    const contributionsContainerMember3 = new ElementCreator({
      tag: "ul",
      className: ["text-element"],
      textContent: "",
    });

    const contribution1Member3 = new ElementCreator({
      tag: "li",
      className: ["text-element"],
      textContent:
        "● Implemented the «validator» component used to validate form fields, as well as the «modal window» component and its implementation on the product page.",
    });

    const contribution2Member3 = new ElementCreator({
      tag: "li",
      className: ["text-element"],
      textContent:
        "● Created and filled in the content of products on commercetools.com.",
    });

    const contribution3Member3 = new ElementCreator({
      tag: "li",
      className: ["text-element"],
      textContent: "● Implemented the «About Us» page.",
    });

    const contribution4Member3 = new ElementCreator({
      tag: "li",
      className: ["text-element"],
      textContent:
        "● Set up the jest testing environment and covered the project code with unit tests.",
    });

    contributionsContainerMember3.addInnerElement(
      contribution1Member3.getElement(),
    );
    contributionsContainerMember3.addInnerElement(
      contribution2Member3.getElement(),
    );
    contributionsContainerMember3.addInnerElement(
      contribution3Member3.getElement(),
    );
    contributionsContainerMember3.addInnerElement(
      contribution4Member3.getElement(),
    );

    discriptionContainer3.addInnerElement(nameMember3.getElement());
    discriptionContainer3.addInnerElement(descriptionMember3.getElement());
    discriptionContainer3.addInnerElement(
      titleContributionsMemeber3.getElement(),
    );
    discriptionContainer3.addInnerElement(
      contributionsContainerMember3.getElement(),
    );

    member3Container.addInnerElement(discriptionContainer3.getElement());
    teamContainer.addInnerElement(member3Container.getElement());

    const rsLogoContainer = new ElementCreator({
      tag: "div",
      className: ["rs-logo"],
      textContent: "",
    });

    const rsLogo = new ElementCreator({
      tag: "img",
      className: ["rs-logo-picture"],
      textContent: "",
      attributes: {
        src: "./img/rss-logo.svg",
        alt: "RS Shool logo",
      },
    });

    const linkToRS = new ElementCreator({
      tag: "a",
      className: ["link-rs"],
      textContent: "RS School",
      attributes: {
        href: "https://rs.school/",
      },
    });

    rsLogoContainer.addInnerElement(rsLogo.getElement());
    rsLogoContainer.addInnerElement(linkToRS.getElement());

    this.aboutContainer.addInnerElement(titleAboutUs.getElement());
    this.aboutContainer.addInnerElement(text.getElement());
    this.aboutContainer.addInnerElement(teamContainer.getElement());
    this.aboutContainer.addInnerElement(rsLogoContainer.getElement());

    const members = [
      "plug",
      member1Container.getElement(),
      member2Container.getElement(),
      member3Container.getElement(),
    ];

    changeVisibleMembers();

    function changeVisibleMembers(): void {
      if (window.location.hash !== "#about") {
        members.forEach((member, index) => {
          if (index !== 0 && typeof member !== "string") {
            member.classList.remove("visible");
          }
        });
      } else {
        let delay = 620;
        members.forEach((member, index) => {
          if (index !== 0 && typeof member !== "string") {
            setTimeout(() => {
              member.classList.add("visible");
            }, delay * index);
          }
        });
      }
    }
    window.addEventListener("hashchange", changeVisibleMembers);
  }
}
