import { ReactNode } from "react";
import { Stack } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { FormattedMessage, useIntl } from "react-intl";
import anomalyDetectionToAvoidBudgetOverruns from "assets/welcome/anomaly-detection-to-avoid-budget-overruns.svg";
import cloudResourceUsageCostTransparency from "assets/welcome/cloud-resource-usage-cost-transparency.svg";
import finopsCloudCostOptimization from "assets/welcome/finops-cloud-cost-optimization.svg";
import finopsReadinessMaturityAssessment from "assets/welcome/finops-readiness-maturity-assessment.svg";
import geoNetworkTrafficCostMap from "assets/welcome/geo-network-traffic-cost-map.svg";
import itEnvironmentManagement from "assets/welcome/it-environment-management.svg";
import Logo from "components/Logo";
import SubTitle from "components/SubTitle";
import TopAlertWrapper from "components/TopAlertWrapper";
import { ALERT_TYPES } from "components/TopAlertWrapper/constants";
import { useIsDownMediaQuery, useIsUpMediaQuery } from "hooks/useMediaQueries";
import { SPACING_2, SPACING_6, SPACING_1 } from "utils/layouts";
import useStyles from "./Greeter.styles";

type GreeterProps = {
  content: ReactNode;
};

const ImagesWithCaptions = () => {
  const intl = useIntl();
  const { classes, cx } = useStyles();
  const isUpLg = useIsUpMediaQuery("lg");

  return (
    <Grid container spacing={isUpLg ? SPACING_6 : SPACING_2} className={classes.imagesWithCaptions}>
      {[
        { caption: "optscale.welcome.caption1", src: finopsCloudCostOptimization },
        { caption: "optscale.welcome.caption2", src: cloudResourceUsageCostTransparency },
        { caption: "optscale.welcome.caption3", src: anomalyDetectionToAvoidBudgetOverruns },
        { caption: "optscale.welcome.caption4", src: finopsReadinessMaturityAssessment },
        { caption: "optscale.welcome.caption5", src: itEnvironmentManagement },
        { caption: "optscale.welcome.caption6", src: geoNetworkTrafficCostMap },
      ].map(({ caption, src }, index) => (
        <Grid item lg={4} md={4} sm={6} key={caption} className={classes.imageWithCaptionWrapper}>
          <img
            src={src}
            alt={intl.formatMessage({ id: caption })}
            data-test-id={`img_banner_${index}`}
            className={classes.image}
          />
          <SubTitle dataTestId={`img_banner_caption_${index}`} color="white" className={cx(classes.caption)}>
            <FormattedMessage id={caption} />
          </SubTitle>
        </Grid>
      ))}
    </Grid>
  );
};

const Greeter = ({ content }: GreeterProps) => {
  const { classes, cx } = useStyles();
  const theme = useTheme();
  const isInVerticalOrder = useIsDownMediaQuery("md");

  const spacing = SPACING_2;
  const halfSpacing = spacing / 2;

  return (
    <>
      <TopAlertWrapper blacklistIds={[ALERT_TYPES.DATA_SOURCES_ARE_PROCESSING, ALERT_TYPES.DATA_SOURCES_PROCEEDED]} />
      <div style={{ padding: theme.spacing(halfSpacing) }}>
        <Grid
          sx={{ m: -halfSpacing }}
          spacing={spacing}
          container
          className={classes.root}
        >
          {/* Left side - Login form */}
          <Grid
            sx={{ p: spacing }}
            md={6}
            xs={12}
            item
            className={cx(classes.leftSideGrid, classes.centeredFlexColumnDirection)}
          >
            <Stack className={classes.wrapper} spacing={SPACING_1}>
              <div>
                <Logo width={200} dataTestId="img_logo" />
              </div>
              <div>{content}</div>
            </Stack>
          </Grid>

          {/* Right side - Branding */}
          <Grid
            sx={{ p: spacing }}
            md={6}
            xs={12}
            item
            className={cx(classes.rightSideGrid, classes.centeredFlexColumnDirection)}
          >
            {isInVerticalOrder ? null : (
              <Stack spacing={3} alignItems="center" sx={{ width: "100%" }}>
                <Logo width={240} white dataTestId="img_logo_white" />
                <Typography
                  variant="h6"
                  color="white"
                  align="center"
                  sx={{ maxWidth: 480, opacity: 0.9, fontWeight: 400, lineHeight: 1.5 }}
                >
                  <FormattedMessage id="cloudHubTagline" defaultMessage="Multi-cloud cost management and FinOps platform" />
                </Typography>
                <ImagesWithCaptions />
              </Stack>
            )}
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default Greeter;
