export default function ContextMenu() {
    <ActionSheet
        ref={actionSheetRef}
        options={options}
        cancelButtonIndex={2}
        onPress={(index) => {
            // Handle the selected option based on the index
            switch (index) {
                case 0:
                    handleDelete();
                    break;
                case 1:
                    handleForward();
                    break;
                default:
                    break;
            }
        }}
    />
}