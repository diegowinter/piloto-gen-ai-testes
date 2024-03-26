interface ServiceHistoryItemProps {
  label: string
  onClick?: () => void
}

function ServiceHistoryItem(props: ServiceHistoryItemProps) {
  return (
    <div
      className="p-2 my-1 whitespace-nowrap overflow-ellipsis cursor-pointer hover:bg-slate-300 dark:hover:bg-slate-900 rounded-md"
      onClick={props.onClick}
    >
      <span className="">
        {props.label}
      </span>
    </div>
  );
}

export default ServiceHistoryItem;