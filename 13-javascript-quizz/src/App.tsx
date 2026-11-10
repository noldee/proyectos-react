import { Container, Stack, Typography } from "@mui/material";
import { JavascriptLogo } from "./JavascriptLogo";
import { Start } from "./Start";
import { useQuestionsStore } from "./store/questions";

const App = () => {
  const question = useQuestionsStore(state => state.question);
  console.log(question);
  return (
    <main>
      <Container maxWidth="sm">
        <Stack
          direction="row"
        >
          <JavascriptLogo />

          <Typography variant="h2" component="h1">
            JavaScript Quiz
          </Typography>
        </Stack>

        {question.length === 0 && <Start />}
        {question.length > 0 && <h2>Juego</h2>}
      </Container>
    </main>
  );
};

export default App;
