import React from "react";
import cx from "clsx";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { Formik, Form, Field } from "formik";
import { TextField as FTextField } from "formik-material-ui";
import { makeStyles } from "@material-ui/core/styles";

import Parser from "../packages/scriplate-parser";

const mockInput = `Hello, {{Your Name}}
I heard you like {{Girl Name[placeholder=baba yaga][value=Kitty]}}

I love you {{Number}}

Thanks {{Your Name}}
From your friend {{Email}}
`;

const useStyles = makeStyles(theme => ({
  margin: {
    margin: 10
  }
}));

export default function Index() {
  const [input, setInput] = React.useState(mockInput);
  const [compiled, setCompiled] = React.useState("");
  const classes = useStyles();

  const { fields, compile, initialValues } = new Parser(input);

  return (
    <Container>
      <Box py={5}>
        <Grid container>
          <Grid item xs={6}>
            <Box>
              <TextField
                id="outlined-multiline-flexible"
                label="Script Template"
                placeholder="Put your script template here"
                multiline={true}
                onChange={e => {
                  setInput(e.target.value);
                }}
                rows={8}
                fullWidth={true}
                value={input}
                margin="normal"
                variant="outlined"
              />
            </Box>
            <Box>
              <div dangerouslySetInnerHTML={{ __html: compiled }} />
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box ml={2} my={4}>
              <Formik
                initialValues={initialValues}
                onSubmit={values => {
                  setCompiled(compile(values));
                }}
                render={() => {
                  return (
                    <Form>
                      {fields.map((field, index) => {
                        const { ...fieldProps } = field.props;
                        return (
                          <Field
                            disabled={false}
                            className={classes.margin}
                            key={index}
                            label={field.name}
                            fullWidth
                            variant="outlined"
                            {...fieldProps}
                            name={field.name}
                            component={FTextField}
                          />
                        );
                      })}
                      <Button
                        type="submit"
                        variant="contained"
                        size="medium"
                        color="primary"
                        className={classes.margin}
                      >
                        Submit
                      </Button>
                    </Form>
                  );
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
