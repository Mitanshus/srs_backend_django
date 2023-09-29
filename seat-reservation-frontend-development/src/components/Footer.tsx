import { Box, Link, Typography } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/Twitter";

const Footer = () => {
  return (
    <Box
      sx={{
        background: "#ffffff", //"#f2f2f2",
        width: "100%",
        position: "fixed",
        flex: 1,
        flexShrink: 1,
        flexDirection: "column",
        //   top : '100vh',
        bottom: 0,
        boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.35)",
        // m : 0
        
      }}
    >
      <Box
        sx={{
          display: { xs: "contents", sm: "contents", md: "flex" },
          justifyContent: "space-between",
          mr: 2,
          ml: 2,
        }}
      >
        <Box
          sx={{
            m: 1,
            display: "flex",
            justifyContent: {
              xs: "center",
              sm: "center",
              md: "space-between",
            },
          }}
        >
          <Link href="https://twitter.com/yodaplustech" target="_blank">
            <TwitterIcon
              sx={{
                p: 0.4,
                color: "#b3d9b3",
                "&:hover": { color: "#198d19" },
                mr: 4,
              }}
            />
          </Link>
          <Link href="https://m.facebook.com/yodaplustech/" target="_blank">
            <FacebookIcon
              sx={{
                p: 0.4,
                color: "#b3d9b3",
                "&:hover": { color: "#198d19" },
                mr: 4,
              }}
            />
          </Link>
          <Link
            href="https://www.linkedin.com/company/yodaplus/"
            target="_blank"
          >
            <LinkedInIcon
              sx={{
                p: 0.4,
                color: "#b3d9b3",
                "&:hover": { color: "#198d19" },
                mr: 4,
              }}
            />
          </Link>
        </Box>
        <Box
          sx={{
            display: "flex",
            mt: 0,
            justifyContent: {
              xs: "center",
              sm: "center",
              md: "space-between",
            },
          }}
        >
          <Typography
            paragraph
            color="textSecondary"
            sx={{ m: { xs: 1, sm: 1, md: 2 } }}
          >
            &copy; {`${new Date().getFullYear()} `} -Yodaplus. All Rights
            Reserved. 
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer
