/* eslint-disable @typescript-eslint/no-explicit-any */

import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  Dispatch,
  SetStateAction,
  useRef,
} from "react";

interface Overview {
  name: string;
  vendor: string;
  currency: string;
  value: number;
  category: string;
  tags: string[];
  branch: string;
  team: string;
  contractType: string;
  status: string;
}

interface Lifecycle {
  startDate: string; // Using string for simplicity, conversion to Date can be handled when needed
  endDate: string;
  noticePeriodDate: string;
  renewalOwners: string[];
}

interface ContractStatus {
  status: string;
  expire: string;
}

interface Contract {
  overview: Overview;
}

interface ContractContextProps {
  contract: any | null;
  setContract: Dispatch<SetStateAction<Contract | null>>;
  contractStatus: ContractStatus;
  setContractStatus: Dispatch<SetStateAction<any>>;
  updateContractOverview: (overview: any) => void;
  signatories: any | null;
  setSignatories: Dispatch<SetStateAction<any>>;
  openDocoment: any | null;
  setOpenDocoment: Dispatch<SetStateAction<any>>;
  selectedModule: any | null;
  setSelectedModule: Dispatch<SetStateAction<any>>;
  sidebarExpanded: any | null;
  setSidebarExpanded: Dispatch<SetStateAction<any>>;

  showCompanySelect: any | null;
  setShowCompanySelect: Dispatch<SetStateAction<any>>;
  showConditionalSelect: any | null;
  setShowConditionalSelect: Dispatch<SetStateAction<any>>;
  showSignatories: any | null;
  setShowSignatories: Dispatch<SetStateAction<any>>;
  selectedApproval: any | null;
  setSelectedApproval: Dispatch<SetStateAction<any>>;
  approvers: any | null;
  setApprovers: Dispatch<SetStateAction<any>>;
  selectedUserApproval: any | null;
  setSelectedUserApproval: Dispatch<SetStateAction<any>>;
  userApproval: any | null;
  setUserApproval: Dispatch<SetStateAction<any>>;
  selectedConditionalApproval: any | null;
  setSelectedConditionalApproval: Dispatch<SetStateAction<any>>;
  userConditionalApproval: any | null;
  setUserConditionalApproval: Dispatch<SetStateAction<any>>;
  conditions: any | null;
  setConditions: Dispatch<SetStateAction<any>>;
  selectedFeild: any | null;
  setSeletedFeild: Dispatch<SetStateAction<any>>;
  type: any | null;
  setType: Dispatch<SetStateAction<any>>;
  viewUser: any | null;
  setViewUser: Dispatch<SetStateAction<any>>;
  collaborater: any | null;
  setCollaborater: Dispatch<SetStateAction<any>>;
  showButtons: any | null;
  setShowButtons: Dispatch<SetStateAction<any>>;
  activeSection: any | null;
  setActiveSection: Dispatch<SetStateAction<any>>;
  comments: any | null;
  setComments: Dispatch<SetStateAction<any>>;
  recipients: any | null;
  setRecipients: Dispatch<SetStateAction<any>>;
  openMultiDialog: any | null;
  setOpenMultiDialog: Dispatch<SetStateAction<any>>;

  dragFields: any | null;
  setDragFields: Dispatch<SetStateAction<any>>;

  editorRefContext: any | null;
  setEditorRefContext: Dispatch<SetStateAction<any>>;

  Drawsignature: any | null;
  setDrawSignature: Dispatch<SetStateAction<any>>;

  uplodTrackFile: any | null;
  setUplodTrackFile: Dispatch<SetStateAction<any>>;

  documentContent: any | null;
  setDocumentContent: Dispatch<SetStateAction<any>>;

  showBlock: any | null;
  setShowBlock: Dispatch<SetStateAction<any>>;

  editMode: any | null;
  setEditMode: Dispatch<SetStateAction<any>>;

  lifecycleData: any | null;
  setLifecycleData: Dispatch<SetStateAction<any>>;

  documentName: any | null;
  setDucomentName: Dispatch<SetStateAction<any>>;

  bgColor: any | null;
  setBgColor: Dispatch<SetStateAction<any>>;

  fontColor: any | null;
  setFontColor: Dispatch<SetStateAction<any>>;

  shadeColor: any | null;
  setShadeColor: Dispatch<SetStateAction<any>>;

  bgColorSvg: any | null;
  setBgColorSvg: Dispatch<SetStateAction<any>>;

  fontColorSvg: any | null;
  setFontColorSvg: Dispatch<SetStateAction<any>>;

  shadeColorSvg: any | null;
  setShadeColorSvg: Dispatch<SetStateAction<any>>;

  selectedFont: any | null;
  setSelectedFont: Dispatch<SetStateAction<any>>;

  selectedFontSize: any | null;
  setSelectedFontSize: Dispatch<SetStateAction<any>>;

  selectedHeaders: any | null;
  setSelectedHeaders: Dispatch<SetStateAction<any>>;

  selectedFontValue: any | null;
  setSelectedFontValue: Dispatch<SetStateAction<any>>;

  selectedFontSizeValue: any | null;
  setSelectedFontSizeValue: Dispatch<SetStateAction<any>>;

  selectedHeadersValue: any | null;
  setSelectedHeadersValue: Dispatch<SetStateAction<any>>;

  documentPageSize: any | null;
  setDocumentPageSize: Dispatch<SetStateAction<any>>;

  documentPageMargins: any | null;
  setDocumentPageMargins: Dispatch<SetStateAction<any>>;

  leftsidebarExpanded: any | null;
  setLeftSidebarExpanded: Dispatch<SetStateAction<any>>;

  attachments: any | null;
  setAttachments: Dispatch<SetStateAction<any>>;
  siningOrder: any | null;
  setSiningOrder: Dispatch<SetStateAction<any>>;
  formState: any | null;
  setFormState: Dispatch<SetStateAction<any>>;
  inputRef: React.RefObject<HTMLInputElement>;
  selectionRef: any | null;

  IsTemplate: any | null;
  setIsTemplate: Dispatch<SetStateAction<any>>;
  temlatePoupup: any | null;
  setTemlatePoupup: Dispatch<SetStateAction<any>>;
  auditTrails: any[];
  setAuditTrails: Dispatch<SetStateAction<any>>;
  trackChanges: any[];
  setTrackChanges: Dispatch<SetStateAction<any>>;
  pages: any[];
  setPages: Dispatch<SetStateAction<any>>;
  currentPage:number | any;
  setCurrentPage:Dispatch<SetStateAction<any>>;
  spacing:string | any;
  setSpacing:Dispatch<SetStateAction<any>>;

  editorsRefContext:any | null;
  setEditorsRefContext:Dispatch<SetStateAction<any>>;

  bgColorSelection:any | null;
  setBgColorSelection:Dispatch<SetStateAction<any>>;

  prevBgColor :string ;
  setPrevBgColor : Dispatch<SetStateAction<any>>;
  prevFontColor :string ;
  setPrevFontColor : Dispatch<SetStateAction<any>>;

  contractNewFont:any | null;
  setContractNewFont :Dispatch<SetStateAction<any>>;

  contractNewFontStyles : any | null; 
  setContractNewFontStyles :Dispatch<SetStateAction<any>>

  contractNewFontSize:any | null ;
  setContractNewFontSize : Dispatch<SetStateAction<any>>;
}

export const ContractContext = createContext<ContractContextProps>({
  contract: null,
  setContract: () => {},
  contractStatus: { status: "", expire: "" },
  setContractStatus: () => {},
  updateContractOverview: () => {},
  signatories: [],
  setSignatories: () => {},
  openDocoment: [],
  setOpenDocoment: () => {},
  selectedModule: {},
  setSelectedModule: () => {},
  sidebarExpanded: {},
  setSidebarExpanded: () => {},
  showCompanySelect: {},
  setShowCompanySelect: () => {},
  showConditionalSelect: {},
  setShowConditionalSelect: () => {},
  showSignatories: {},
  setShowSignatories: () => {},
  selectedApproval: {},
  setSelectedApproval: () => {},
  approvers: {},
  setApprovers: () => {},
  selectedUserApproval: {},
  setSelectedUserApproval: () => {},
  userApproval: {},
  setUserApproval: () => {},
  selectedConditionalApproval: {},
  setSelectedConditionalApproval: () => {},
  userConditionalApproval: {},
  setUserConditionalApproval: () => {},
  conditions: [],
  setConditions: () => {},
  selectedFeild: [],
  setSeletedFeild: () => {},
  type: {},
  setType: () => {},
  viewUser: {},
  setViewUser: () => {},
  collaborater: {},
  setCollaborater: () => {},
  showButtons: {},
  setShowButtons: () => {},
  activeSection: {},
  setActiveSection: () => {},
  comments: {},
  setComments: () => {},
  recipients: {},
  setRecipients: () => {},
  openMultiDialog: {},
  setOpenMultiDialog: () => {},
  dragFields: {},
  setDragFields: () => {},
  editorRefContext: {},
  setEditorRefContext: () => {},
  editorsRefContext: [],
  setEditorsRefContext: () => {},
  Drawsignature: {},
  setDrawSignature: () => {},
  uplodTrackFile: {},
  setUplodTrackFile: () => {},
  documentContent: {},
  setDocumentContent: () => {},
  showBlock: {},
  setShowBlock: () => {},
  editMode: {},
  setEditMode: () => {},
  lifecycleData: {},
  setLifecycleData: () => {},
  documentName: {},
  setDucomentName: () => {},
  leftsidebarExpanded: {},
  setLeftSidebarExpanded: () => {},
  attachments: {},
  setAttachments: () => {},
  siningOrder: {},
  setSiningOrder: () => {},
  formState: {},
  setFormState: () => {},
  IsTemplate: {},
  setIsTemplate: () => {},
  temlatePoupup: {},
  setTemlatePoupup: () => {},
  inputRef: { current: null },
  auditTrails: [],
  setAuditTrails: () => {},
  trackChanges: [],
  setTrackChanges: () => {},
  documentPageSize: {},
  setDocumentPageSize: () => {},
  documentPageMargins: {},
  setDocumentPageMargins: () => {},
  bgColor: {},
  setBgColor: () => {},
  shadeColor: {},
  setShadeColor: () => {},
  fontColor: {},
  setFontColor: () => {},
  fontColorSvg: {},
  setFontColorSvg: () => {},
  bgColorSvg: {},
  setBgColorSvg: () => {},
  setShadeColorSvg: () => {},
  shadeColorSvg: {},
  selectionRef: { current: null },
  selectedFont: {},
  setSelectedFont: () => {},
  selectedFontSize: {},
  setSelectedFontSize: () => {},
  selectedHeaders: {},
  setSelectedHeaders: () => {},
  selectedFontValue: {},
  setSelectedFontValue: () => {},
  selectedFontSizeValue: {},
  setSelectedFontSizeValue: () => {},
  selectedHeadersValue: {},
  setSelectedHeadersValue: () => {},
  pages:[],
  setPages:()=>{},
  currentPage:0,
  setCurrentPage:()=>{},
  spacing:"",
  setSpacing:()=>{},
  bgColorSelection:{},
  setBgColorSelection:()=>{},
  prevBgColor:"",
  setPrevBgColor:() => {},
  prevFontColor:"",
  setPrevFontColor:() => {},
  contractNewFont:[],
  setContractNewFont:()=>{},
  setContractNewFontStyles:()=>{},
  contractNewFontStyles:{},
  contractNewFontSize:[],
  setContractNewFontSize:()=>{}
});

export const ContractProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const inputRef = useRef<any>(null);
  const [IsTemplate, setIsTemplate] = useState(false);
  const [temlatePoupup, setTemlatePoupup] = useState(false);
  const [contract, setContract] = useState<Contract | null>(null);
  const [siningOrder, setSiningOrder] = useState(false);
  const [documentName, setDucomentName] = useState("");
  const [leftsidebarExpanded, setLeftSidebarExpanded] = useState(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [documentContent, setDocumentContent] = useState<any>(null);
  const [showBlock, setShowBlock] = useState<string>("");
  const [Drawsignature, setDrawSignature] = useState(null);
  const [recipients, setRecipients] = useState<string[]>([]);
  const [signatories, setSignatories] = useState<string[]>([]);
  const [comments, setComments] = useState<Array<any>>([]);
  const [formState, setFormState] = useState({
    name: "",
    with_name: undefined,
    disription: undefined,
    currency: undefined,
    value: undefined,
    tags: undefined,
    // branch: "",
    teams: undefined,
    category: undefined,
    subcategory: undefined,
    additionalFields: [],
  });
  const [lifecycleData, setLifecycleData] = useState({
    activeSection: "",
    showButtons: false,
    recipients: [],
    formData: {
      checkboxStates: {
        isEvergreen: false,
        isRenewalsActive: false,
        isNotificationEmailEnabled: false,
        isRemindersEnabled: false,
      },
      dateFields: {
        signedOn: "",
        startDate: "",
        endDate: "",
        noticePeriodDate: "",
      },
      renewalDetails: {
        renewalType: "days",
        renewalPeriod: 0,
      },
      notificationDetails: {
        notifyOwner: false,
        additionalRecipients: [],
      },
      reminderSettings: {
        firstReminder: 0,
        daysBetweenReminders: 0,
        daysBeforeFinalExpiration: 0,
      },
    },
  });
  const [collaborater, setCollaborater] = useState<string[]>([]);
  const [activeSection, setActiveSection] = useState("");
  const [openMultiDialog, setOpenMultiDialog] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const [openDocoment, setOpenDocoment] = useState(false);
  const [selectedModule, setSelectedModule] = useState<string>("overview");
  const [sidebarExpanded, setSidebarExpanded] = useState<boolean>(false);
  const [attachments, setAttachments] = useState<Array<any>>([]);
  const [showCompanySelect, setShowCompanySelect] = useState(false);
  const [showConditionalSelect, setShowConditionalSelect] = useState(false);
  const [showSignatories, setShowSignatories] = useState<any>("");
  const [selectedApproval, setSelectedApproval] = useState("");
  const [approvers, setApprovers] = useState<any[]>([]);
  const [selectedUserApproval, setSelectedUserApproval] = useState("");
  const [userApproval, setUserApproval] = useState<any[]>([]);
  const [selectedFeild, setSeletedFeild] = useState("");
  const [type, setType] = useState("");
  const [viewUser, setViewUser] = useState(false);
  const [dragFields, setDragFields] = useState("");
  const [editorRefContext, setEditorRefContext] = useState("");
  const [editorsRefContext, setEditorsRefContext] = useState([]);
  const [uplodTrackFile, setUplodTrackFile] = useState<any | null>("");
  const [conditions, setConditions] = useState([
    {
      comparisonOperator: "",
      value: "",
      userSelection: "",
      userDisplayName: "",
    },
  ]);
  const [selectedConditionalApproval, setSelectedConditionalApproval] =
    useState("");
  const [userConditionalApproval, setUserConditionalApproval] = useState<any[]>(
    []
  );
  const [contractStatus, setContractStatus] = useState<ContractStatus>({
    status: "",
    expire: "",
  });

  const updateContractOverview = (overview: any) => {
    if (contract !== null) {
      console.log(overview, "updateContractOverview");
      // Check if 'contract' is not null
      setContract({
        ...contract,
        overview,
      });
    } else {
      console.log(overview, "over");
      setContract(
        // Initialize with default or empty values for other properties
        overview
      );
    }
  };

  useEffect(() => {
    const storedContractData = localStorage.getItem("contract");
    if (storedContractData) {
      setContract(JSON.parse(storedContractData));
    }
    const storedContractStatus = localStorage.getItem("contractStatus");
    if (storedContractStatus) {
      setContractStatus(JSON.parse(storedContractStatus));
    }
    const storedContractSignature = localStorage.getItem("contractSignature");
    if (storedContractSignature) {
      setSignatories(JSON.parse(storedContractSignature));
    }
    const storedContractSignatureOpen = localStorage.getItem("openDocoment");
    if (storedContractSignatureOpen) {
      setOpenDocoment(JSON.parse(storedContractSignatureOpen));
    }
    const storedContractselectedModule =
      localStorage.getItem("sidebarExpanded");
    if (storedContractselectedModule) {
      setSidebarExpanded(JSON.parse(storedContractselectedModule));
    }
    const storedContractsidebarExand = localStorage.getItem("sid");
    if (storedContractsidebarExand) {
      setSelectedModule(JSON.parse(storedContractsidebarExand));
    }
    const storedshowConditionalSelect =
      localStorage.getItem("ConditionalSelect");
    if (storedshowConditionalSelect) {
      setShowConditionalSelect(JSON.parse(storedshowConditionalSelect));
    }
    const storedsetShowCompanySelect = localStorage.getItem("CompanySelect");
    if (storedsetShowCompanySelect) {
      setShowCompanySelect(JSON.parse(storedsetShowCompanySelect));
    }
    const storedsetShowsignatori = localStorage.getItem("showSignatories");
    if (storedsetShowsignatori) {
      setShowSignatories(JSON.parse(storedsetShowsignatori));
    }
    const storedsetselectedApproval = localStorage.getItem("selectedApproval");

    if (storedsetselectedApproval) {
      setSelectedApproval(JSON.parse(storedsetselectedApproval));
    }
    const storedsetApprovers = localStorage.getItem("approvers");
    if (storedsetApprovers) {
      setApprovers(JSON.parse(storedsetApprovers));
    }
    const storedselectedUserApproval = localStorage.getItem("selecteApprover");
    if (storedselectedUserApproval) {
      setSelectedApproval(JSON.parse(storedselectedUserApproval));
    }
    const storedviewUser = localStorage.getItem("viewUser");
    if (storedviewUser) {
      setViewUser(JSON.parse(storedviewUser));
    }
    const storeduserApproval = localStorage.getItem("userApproval");
    if (storeduserApproval) {
      setUserApproval(JSON.parse(storeduserApproval));
    }
    const storeduserconditions = localStorage.getItem("conditions");
    if (storeduserconditions) {
      setConditions(JSON.parse(storeduserconditions));
    }
    const storeduserselectedConditionalApproval = localStorage.getItem(
      "selectedConditionalApproval"
    );
    if (storeduserselectedConditionalApproval) {
      setSelectedConditionalApproval(
        JSON.parse(storeduserselectedConditionalApproval)
      );
    }
    const storeduserConditionalApproval = localStorage.getItem(
      "userConitioanalApproval"
    );
    if (storeduserConditionalApproval) {
      setUserConditionalApproval(JSON.parse(storeduserConditionalApproval));
    }
    const storedselectedFeild = localStorage.getItem("selectedFeild");
    if (storedselectedFeild) {
      setSeletedFeild(JSON.parse(storedselectedFeild));
    }
    const storedtype = localStorage.getItem("type");
    if (storedtype) {
      setSeletedFeild(JSON.parse(storedtype));
    }
    const storedapproval = localStorage.getItem("approval");
    if (storedapproval) {
      setUserApproval(JSON.parse(storedapproval));
    }
    const storedShowbutton = localStorage.getItem("showButtons");
    if (storedShowbutton) {
      setShowButtons(JSON.parse(storedShowbutton));
    }
    const storedComments = localStorage.getItem("comments");
    if (storedComments) {
      setComments(JSON.parse(storedComments));
    }
    const storedCollaborater = localStorage.getItem("collaborater");
    if (storedCollaborater) {
      setComments(JSON.parse(storedCollaborater));
    }
    const storedrecipients = localStorage.getItem("recipients");
    if (storedrecipients) {
      setComments(JSON.parse(storedrecipients));
    }
    const storedopenMultiDialog = localStorage.getItem("openMultiDialog");
    if (storedopenMultiDialog) {
      setOpenMultiDialog(JSON.parse(storedopenMultiDialog));
    }

    const storeDragFields = localStorage.getItem("dragFields");
    if (storeDragFields) {
      setDragFields(JSON.parse(storeDragFields));
    }

    const editorRefFun = localStorage.getItem("editorRefContext");
    if (editorRefFun) {
      setEditorRefContext(JSON.parse(editorRefFun));
    }
    const Drawsignature = localStorage.getItem("Drawsignature");
    if (Drawsignature) {
      setDrawSignature(JSON.parse(Drawsignature));
    }
    const uplodTrackFile = localStorage.getItem("uplodTrackFile");
    if (uplodTrackFile) {
      setUplodTrackFile(JSON.parse(uplodTrackFile));
    }
    const documentContent = localStorage.getItem("documentContent");
    if (documentContent) {
      setDocumentContent(JSON.parse(documentContent));
    }
    const showBlock = localStorage.getItem("showBlock");
    if (showBlock) {
      setShowBlock(JSON.parse(showBlock));
    }
    const editMode = localStorage.getItem("editMode");
    if (editMode) {
      setEditMode(JSON.parse(editMode));
    }
    const lifecycleData = localStorage.getItem("lifecycleData");
    if (lifecycleData) {
      setLifecycleData(JSON.parse(lifecycleData));
    }
    const documentName = localStorage.getItem("documentName");
    if (documentName) {
      setDucomentName(JSON.parse(documentName));
    }
    const leftsidebarExpanded = localStorage.getItem("leftsidebarExpanded");
    if (leftsidebarExpanded) {
      setLeftSidebarExpanded(JSON.parse(leftsidebarExpanded));
    }
    const attachments = localStorage.getItem("attachments");
    if (attachments) {
      setAttachments(JSON.parse(attachments));
    }
    const siningOrder = localStorage.getItem("siningOrder");
    if (siningOrder) {
      setSiningOrder(JSON.parse(siningOrder));
    }
    const formState = localStorage.getItem("formState");
    if (formState) {
      setFormState(JSON.parse(formState));
    }
  }, []);
  useEffect(() => {
    if (contract) {
      localStorage.setItem("contract", JSON.stringify(contract));
    }

    if (comments) {
      localStorage.setItem("comments", JSON.stringify(comments));
    }
    if (collaborater) {
      localStorage.setItem("collaborater", JSON.stringify(collaborater));
    }
    if (recipients) {
      localStorage.setItem("recipients", JSON.stringify(recipients));
    }
    if (lifecycleData) {
      localStorage.setItem("lifecycleData", JSON.stringify(lifecycleData));
    }
    if (attachments) {
      localStorage.setItem("attachments", JSON.stringify(attachments));
    }
  }, [contract, comments, collaborater, attachments]);

  const [auditTrails, setAuditTrails] = useState<any>([]);

  const [trackChanges, setTrackChanges] = useState<any>([]);

  const [documentPageSize, setDocumentPageSize] = useState({
    title: "A4",
    desc: "21 cm x 29.7 cm",
    width: "21cm",
    height: "29.7cm",
  });

  const [documentPageMargins, setDocumentPageMargins] = useState({
    title: "Standard",
    top: "2.54cm",
    left: "2.54cm",
    right: "2.54cm",
    bottom: "2.54cm",
  });

  const [bgColor, setBgColor] = useState("#fefefe");
  const [shadeColor, setShadeColor] = useState("");
  const [fontColor, setFontColor] = useState("#000000");

  const [bgColorSvg, setBgColorSvg] = useState("#D9D9D940");
  const [shadeColorSvg, setShadeColorSvg] = useState("");
  const [fontColorSvg, setFontColorSvg] = useState("#000000");

  const selectionRef: any = useRef();

  const [selectedFont, setSelectedFont] = useState("arial");
  const [selectedHeaders, setSelectedHeaders] = useState(0);
  const [selectedFontSize, setSelectedFontSize] = useState("12px");

  const [selectedFontValue, setSelectedFontValue] = useState("arial");
  const [selectedHeadersValue, setSelectedHeadersValue] = useState(0);
  const [selectedFontSizeValue, setSelectedFontSizeValue] = useState("12px");
  const [pages, setPages] = useState([{ content: '' }]);
  const [currentPage, setCurrentPage] = useState(0); 
  const [spacing, setSpacing] = useState("1.5");

  const [bgColorSelection,setBgColorSelection] = useState(null)
  const [prevBgColor,setPrevBgColor] = useState("#fefefe");
  const [prevFontColor,setPrevFontColor] = useState("#000000");

  const [contractNewFont,setContractNewFont] = useState<any>([]);
  const [contractNewFontStyles,setContractNewFontStyles] = useState<any>([]);

  const [contractNewFontSize,setContractNewFontSize] = useState<any>([])
  return (
    <ContractContext.Provider
      value={{
        contract,
        setContract,
        contractStatus,
        setContractStatus,
        updateContractOverview,
        signatories,
        setSignatories,
        openDocoment,
        setOpenDocoment,
        selectedModule,
        setSelectedModule,
        sidebarExpanded,
        setSidebarExpanded,
        setShowCompanySelect,
        showCompanySelect,
        setShowConditionalSelect,
        showConditionalSelect,
        setShowSignatories,
        showSignatories,
        setSelectedApproval,
        selectedApproval,
        approvers,
        setApprovers,
        setSelectedUserApproval,
        selectedUserApproval,
        setUserApproval,
        userApproval,
        setSelectedConditionalApproval,
        selectedConditionalApproval,
        setUserConditionalApproval,
        userConditionalApproval,
        conditions,
        setConditions,
        selectedFeild,
        setSeletedFeild,
        setType,
        type,
        viewUser,
        setViewUser,
        collaborater,
        setCollaborater,
        showButtons,
        setShowButtons,
        setActiveSection,
        activeSection,
        comments,
        setComments,
        recipients,
        setRecipients,
        setOpenMultiDialog,
        openMultiDialog,
        dragFields,
        setDragFields,
        editorRefContext,
        setEditorRefContext,
        editorsRefContext,
        setEditorsRefContext,
        Drawsignature,
        setDrawSignature,
        uplodTrackFile,
        setUplodTrackFile,
        documentContent,
        setDocumentContent,
        showBlock,
        setShowBlock,
        editMode,
        setEditMode,
        lifecycleData,
        setLifecycleData,
        documentName,
        setDucomentName,
        leftsidebarExpanded,
        setLeftSidebarExpanded,
        attachments,
        setAttachments,
        siningOrder,
        setSiningOrder,
        inputRef,
        formState,
        setFormState,
        IsTemplate,
        setIsTemplate,
        temlatePoupup,
        setTemlatePoupup,
        auditTrails,
        setAuditTrails,
        trackChanges,
        setTrackChanges,
        documentPageSize,
        setDocumentPageSize,
        documentPageMargins,
        setDocumentPageMargins,
        bgColor,
        setBgColor,
        fontColor,
        setFontColor,
        shadeColor,
        setShadeColor,
        fontColorSvg,
        setBgColorSvg,
        bgColorSvg,
        shadeColorSvg,
        setShadeColorSvg,
        setFontColorSvg,
        selectionRef,
        selectedFont,
        selectedFontSize,
        selectedHeaders,
        setSelectedFont,
        setSelectedFontSize,
        setSelectedHeaders,
        selectedFontSizeValue,
        selectedFontValue,
        selectedHeadersValue,
        setSelectedFontSizeValue,
        setSelectedFontValue,
        setSelectedHeadersValue,
        pages,
        setPages,
        currentPage,
        setCurrentPage,
        spacing,
        setSpacing,
        bgColorSelection,
        setBgColorSelection,
        prevBgColor,
        setPrevBgColor,
        prevFontColor,
        setPrevFontColor,
        contractNewFont,
        setContractNewFont,
        setContractNewFontStyles,
        contractNewFontStyles,
        contractNewFontSize,
        setContractNewFontSize
      }}
    >
      {children}
    </ContractContext.Provider>
  );
};
