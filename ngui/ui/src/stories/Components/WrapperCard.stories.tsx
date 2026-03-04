import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";
import WrapperCard from "components/WrapperCard";

export default {
  component: WrapperCard,
  argTypes: {
    link: { name: "Link", control: "text", defaultValue: "/test" },
    href: { name: "Href", control: "text", defaultValue: "https://cloudhub.com/" }
  }
};

export const basic = () => <WrapperCard title="CloudHub" buttonText="Go to CloudHub" />;

export const withText = () => (
  <WrapperCard title="CloudHub" button={{ show: true, messageId: "goToDashboard" }}>
    Some text
  </WrapperCard>
);

export const withInternalLink = (args) => (
  <WrapperCard
    title="CloudHub"
    button={{
      show: true,
      messageId: "goToDashboard",
      link: args.link
    }}
  >
    Some text
  </WrapperCard>
);

export const withExternalLink = (args) => (
  <WrapperCard
    title="CloudHub"
    button={{
      show: true,
      messageId: "buy",
      href: args.href
    }}
  >
    Some text
  </WrapperCard>
);

export const withTitleButton = () => (
  <WrapperCard
    title="CloudHub"
    titleButton={{
      type: "button",
      tooltip: {
        title: "Button tooltip"
      },
      buttonProps: {
        messageId: "add"
      }
    }}
  >
    Some text
  </WrapperCard>
);

export const withTitleIconButton = () => (
  <WrapperCard
    title="CloudHub"
    titleButton={{
      type: "icon",
      tooltip: {
        title: "Button tooltip"
      },
      buttonProps: {
        icon: <ListAltOutlinedIcon />
      }
    }}
  >
    Some text
  </WrapperCard>
);
