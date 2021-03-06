import React from "react";
import { Grid, MenuItem, Select } from "@material-ui/core";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import { Paper, Typography } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Radio from "@material-ui/core/Radio";

import FormControlLabel from "@material-ui/core/FormControlLabel";
import AccordionActions from "@material-ui/core/AccordionActions";
import Divider from "@material-ui/core/Divider";
import VisibilityIcon from "@material-ui/icons/Visibility";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import FilterNoneIcon from "@material-ui/icons/FilterNone";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import DragIndicatorIcon from "@material-ui/icons/DragIndicator";
import CircularProgress from "@material-ui/core/CircularProgress";
import SaveIcon from "@material-ui/icons/Save";

function QuestionsTab(props) {
  const { setInStorage } = window;
  const [questions, setQuestions] = React.useState([]);

  const [formData, setFormData] = React.useState({});
  const [loadingFormData, setLoadingFormData] = React.useState(true);

  React.useEffect(() => {
    if (props.formData.questions !== undefined) {
      if (props.formData.questions.length === 0) {
        setQuestions([
          {
            questionText: "Question",
            options: [{ optionText: "Option 1" }],
            open: false,
          },
        ]);
      } else {
        setQuestions(props.formData.questions);
      }
    }
    console.log("props.formData: ", props.formData);
    setLoadingFormData(false);
    setFormData(props.formData);
  }, [props.formData]);

  function saveQuestions() {
    console.log("auto saving questions initiated");
    var data = {
      formId: formData.id,
      name: formData.name,
      description: formData.description,
      questions: questions,
    };
    console.log("data: ", data);
    setInStorage(`formData${formData.id}`, data);
    alert("Form Saved!");
  }

  function addMoreQuestionField() {
    expandCloseAll();
    setQuestions((questions) => [
      ...questions,
      {
        questionText: "Question",
        options: [{ optionText: "Option 1" }],
        open: true,
      },
    ]);
  }

  function copyQuestion(i) {
    let qs = [...questions];
    expandCloseAll();
    const myNewOptions = [];
    qs[i].options.forEach((opn) => {
      if (opn.optionImage !== undefined || opn.optionImage !== "") {
        var opn1new = {
          optionText: opn.optionText,
          optionImage: opn.optionImage,
        };
      } else {
        var opn1new = {
          optionText: opn.optionText,
        };
      }
      myNewOptions.push(opn1new);
    });
    const qImage = qs[i].questionImage || "";
    var newQuestion = {
      questionText: qs[i].questionText,
      questionImage: qImage,
      options: myNewOptions,
      open: true,
    };
    setQuestions((questions) => [...questions, newQuestion]);
  }

  function updateImageLink(link, context) {
    var optionsOfQuestion = [...questions];
    var i = context.question;

    if (context.option == null) {
      optionsOfQuestion[i].questionImage = link;
    } else {
      var j = context.option;
      optionsOfQuestion[i].options[j].optionImage = link;
    }
    setQuestions(optionsOfQuestion);
  }

  function deleteQuestion(i) {
    let qs = [...questions];
    if (questions.length > 1) {
      qs.splice(i, 1);
    }
    setQuestions(qs);
  }

  function handleOptionValue(text, i, j) {
    var optionsOfQuestion = [...questions];
    optionsOfQuestion[i].options[j].optionText = text;
    //newMembersEmail[i]= email;
    setQuestions(optionsOfQuestion);
  }

  function handleQuestionValue(text, i) {
    var optionsOfQuestion = [...questions];
    optionsOfQuestion[i].questionText = text;
    setQuestions(optionsOfQuestion);
  }

  function handleType(text, i) {
    console.log("text, i: ", text, i);
  }

  function onDragEnd(result) {
    if (!result.destination) {
      return;
    }
    var itemgg = [...questions];

    const itemF = reorder(
      itemgg,
      result.source.index,
      result.destination.index
    );

    setQuestions(itemF);
  }

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  function showAsQuestion(i) {
    let qs = [...questions];
    qs[i].open = false;
    setQuestions(qs);
  }

  function addOption(i) {
    var optionsOfQuestion = [...questions];
    if (optionsOfQuestion[i].options.length < 5) {
      optionsOfQuestion[i].options.push({
        optionText: "Option " + (optionsOfQuestion[i].options.length + 1),
      });
    } else {
      console.log("Max  5 options ");
    }
    //console.log(optionsOfQuestion);
    setQuestions(optionsOfQuestion);
  }

  function removeOption(i, j) {
    var optionsOfQuestion = [...questions];
    if (optionsOfQuestion[i].options.length > 1) {
      optionsOfQuestion[i].options.splice(j, 1);
      setQuestions(optionsOfQuestion);
      console.log(i + "__" + j);
    }
  }

  function expandCloseAll() {
    let qs = [...questions];
    for (let j = 0; j < qs.length; j++) {
      qs[j].open = false;
    }
    setQuestions(qs);
  }

  function handleExpand(i) {
    let qs = [...questions];
    for (let j = 0; j < qs.length; j++) {
      if (i === j) {
        qs[i].open = true;
      } else {
        qs[j].open = false;
      }
    }
    setQuestions(qs);
  }

  function questionsUI() {
    return questions.map((ques, i) => (
      <Draggable key={i} draggableId={i + "id"} index={i}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <div>
              <div style={{ marginBottom: "15px" }}>
                <div style={{ width: "100%", marginBottom: "-7px" }}>
                  <DragIndicatorIcon
                    style={{ transform: "rotate(-90deg)", color: "#DAE0E2" }}
                    fontSize="small"
                  />
                </div>

                <Accordion
                  onChange={() => {
                    handleExpand(i);
                  }}
                  expanded={questions[i].open}
                >
                  <AccordionSummary
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    elevation={1}
                    style={{ width: "100%" }}
                  >
                    {!questions[i].open ? (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-start",
                          marginLeft: "3px",
                          paddingTop: "15px",
                          paddingBottom: "15px",
                        }}
                      >
                        <Typography style={{ marginLeft: "0px" }}>
                          {i + 1}. {ques.questionText}
                        </Typography>

                        {ques.options.map((op, j) => (
                          <div key={j}>
                            <div style={{ display: "flex" }}>
                              <FormControlLabel
                                disabled
                                control={
                                  <Radio style={{ marginRight: "3px" }} />
                                }
                                label={
                                  <Typography style={{ color: "#555555" }}>
                                    {ques.options[j].optionText}
                                  </Typography>
                                }
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      ""
                    )}
                  </AccordionSummary>

                  <AccordionDetails>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        marginLeft: "15px",
                        marginTop: "-15px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          width: "100%",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography style={{ marginTop: "20px" }}>
                          {i + 1}.
                        </Typography>
                        <TextField
                          fullWidth={true}
                          placeholder="Question Text"
                          style={{ marginBottom: "18px" }}
                          rows={2}
                          rowsMax={20}
                          multiline={true}
                          value={ques.questionText}
                          variant="filled"
                          onChange={(e) => {
                            handleQuestionValue(e.target.value, i);
                          }}
                        />
                      </div>
                      {/* <div style={{ width: "100%" }}>
                        <Select
                          fullWidth={true}
                          style={{ marginBottom: "18px" }}
                          fullWidth={true}
                          placeholder="Question Text"
                          style={{ marginBottom: "18px" }}
                          rows={2}
                          rowsMax={20}
                          multiline={true}
                          variant="filled"
                          value={ques.type}
                          onChange={(e) => {
                            handleType(e.target.value, i);
                          }}
                        >
                          <MenuItem value={"radio"}>Radio</MenuItem>
                          <MenuItem value={"text"}>Text</MenuItem>
                          <MenuItem value={"select"}>Select</MenuItem>
                        </Select>
                      </div> */}
                      <div style={{ width: "100%" }}>
                        {ques.options.map((op, j) => (
                          <div key={j}>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "row",
                                marginLeft: "-12.5px",
                                justifyContent: "space-between",
                                paddingTop: "5px",
                                paddingBottom: "5px",
                              }}
                            >
                              <Radio disabled />
                              <TextField
                                fullWidth={true}
                                placeholder="Option text"
                                style={{ marginTop: "5px" }}
                                value={ques.options[j].optionText}
                                onChange={(e) => {
                                  handleOptionValue(e.target.value, i, j);
                                }}
                              />

                              <IconButton
                                aria-label="delete"
                                onClick={() => {
                                  removeOption(i, j);
                                }}
                              >
                                <CloseIcon />
                              </IconButton>
                            </div>
                          </div>
                        ))}
                      </div>

                      {ques.options.length < 5 ? (
                        <div>
                          <FormControlLabel
                            disabled
                            control={<Radio />}
                            label={
                              <Button
                                size="small"
                                onClick={() => {
                                  addOption(i);
                                }}
                                style={{
                                  textTransform: "none",
                                  marginLeft: "-5px",
                                }}
                              >
                                Add Option
                              </Button>
                            }
                          />
                        </div>
                      ) : (
                        ""
                      )}

                      <br></br>
                      <br></br>

                      <Typography variant="body2" style={{ color: "grey" }}>
                        You can add maximum 5 options. If you want to add more
                        then change in settings. Multiple choice single option
                        is availible
                      </Typography>
                    </div>
                  </AccordionDetails>

                  <Divider />

                  <AccordionActions>
                    <IconButton
                      aria-label="View"
                      onClick={() => {
                        showAsQuestion(i);
                      }}
                    >
                      <VisibilityIcon />
                    </IconButton>

                    <IconButton
                      aria-label="Copy"
                      onClick={() => {
                        copyQuestion(i);
                      }}
                    >
                      <FilterNoneIcon />
                    </IconButton>
                    <Divider orientation="vertical" flexItem />

                    <IconButton
                      aria-label="delete"
                      onClick={() => {
                        deleteQuestion(i);
                      }}
                    >
                      <DeleteOutlineIcon />
                    </IconButton>
                  </AccordionActions>
                </Accordion>
              </div>
            </div>
          </div>
        )}
      </Draggable>
    ));
  }

  return (
    <div
      style={{ marginTop: "15px", marginBottom: "7px", paddingBottom: "30px" }}
    >
      <Grid container direction="column" justify="center" alignItems="center">
        {loadingFormData ? <CircularProgress /> : ""}

        <Grid item xs={12} sm={5} style={{ width: "100%" }}>
          <Grid style={{ borderTop: "10px solid teal", borderRadius: 10 }}>
            <div>
              <div>
                <Paper elevation={2} style={{ width: "100%" }}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      marginLeft: "15px",
                      paddingTop: "20px",
                      paddingBottom: "20px",
                    }}
                  >
                    <Typography
                      variant="h4"
                      style={{
                        fontFamily: "sans-serif Roboto",
                        marginBottom: "15px",
                      }}
                    >
                      {formData.name}
                    </Typography>
                    <Typography variant="subtitle1">
                      {formData.description}
                    </Typography>
                  </div>
                </Paper>
              </div>
            </div>
          </Grid>

          <Grid style={{ paddingTop: "10px" }}>
            <div>
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="droppable">
                  {(provided, snapshot) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                      {questionsUI()}

                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
              <div>
                <Button
                  variant="contained"
                  onClick={addMoreQuestionField}
                  endIcon={<AddCircleIcon />}
                  style={{ margin: "5px" }}
                >
                  Add Question{" "}
                </Button>

                <Button
                  variant="contained"
                  color="primary"
                  onClick={saveQuestions}
                  style={{ margin: "15px" }}
                  endIcon={<SaveIcon />}
                >
                  Save Questions{" "}
                </Button>
              </div>
            </div>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
export default QuestionsTab;
